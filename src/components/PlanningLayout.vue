<template>
  <el-row id="app">
    <h1>Planning pour {{ planning.codeFormation }}</h1>
    <el-tabs :tab-position="right" style="height: 200px;">
    <el-tab-pane label="Planning">
      <div>
        <form action="">
          <div class="block">
            <el-date-picker
              v-model="periodeFormation"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="Début de la formation"
              end-placeholder="Fin de la formation"
              firstDayOfWeek="2">
            </el-date-picker>
          </div>
          <!--<label>debut : <input v-model="planning.periodeFormation.debut" type="date"></label>-->
          <!--<label>fin : <input v-model="planning.periodeFormation.fin" type="date"></label>-->
          <el-select v-model="selectedLieux" multiple placeholder="Lieux">
            <el-option
              v-for="lieu in lieux"
              :key="lieu.codeLieu"
              :label="lieu.libelle"
              :value="lieu.codeLieu">
            </el-option>
          </el-select>

          <el-button type="primary" round plain v-on:click="showPlanning()">Générer</el-button>
        </form>
      </div>
      <div>
      <div v-if="loading" class="message">
        Géneration des plannings en cours...</div>
      </div>
      <div v-if="!calendriers.length && loaded && !loading" class="message">
        Aucune solution possible pour les paramètres donnés.
      </div>
      <div id="calendriers" v-if="!loading">
        <table v-for="cal in calendriers" v-bind:key="cal.id">
          <tr>
            <th>Cours</th>
            <th>Durée</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Lieu</th>
          </tr>
          <tr v-for="cou in cal.cours" v-bind:key="cou.idCours">
            <td>{{ cou.libelleCours }}</td>
            <td>{{ cou.dureeReelleEnHeures }}</td>
            <td>{{ cou.debut }}</td>
            <td>{{ cou.fin }}</td>
            <td>{{ cou.lieu.libelle }}</td>
          </tr>
          <tr class="total">
            <td>Total</td>
            <td>{{ cal.nbTotalHeures }}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Contraintes">Contraintes</el-tab-pane>
    <el-tab-pane label="Modules">Modules</el-tab-pane>
    <el-tab-pane label="Historique">Historique</el-tab-pane>
  </el-tabs>

    </el-row>
</template>

<script>
import CalendarView from 'vue-simple-calendar'
import axios from 'axios'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'app',

  data () {
    return {
      showDate: new Date(),
      periodeFormation: ['2018-01-02', '2019-03-11'],
      dateFormation: [],
      loaded: false,
      loading: false,
      selectedLieux: [],
      planning: {
        codeFormation: this.$route.params.id
      },
      calendriers: [],
      lieux: []
    }
  },

  components: {
    CalendarView
  },
  created () {
    this.getLieu()
  },
  methods: {
    showPlanning () {
      this.loading = true
      const [debut, fin] = this.periodeFormation
      axios
        .post('http://localhost:9000/generationCal', {
          ...this.planning,
          periodeFormation: { debut, fin },
          contraintes: [{ idLieux: this.selectedLieux }]
        })
        .then(response => {
          this.calendriers = response.data
            .filter(calendrier => calendrier.cours.length)
            .map((calendrier, i) => ({
              ...calendrier,
              id: i,
              nbTotalHeures: calendrier.cours.reduce(
                (acc, cours) => acc + cours.dureeReelleEnHeures,
                0
              ),
              cours: calendrier.cours.map(cours => {
                const lieu = this.lieux.find(l => cours.codeLieu === l.codeLieu) || {}
                return { ...cours, lieu }
              })
            }))
          this.loaded = true
          this.loading = false
        })
    },
    getLieu () {
      axios.get('http://localhost:9000/lieux').then(response => {
        this.lieux = response.data
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*color: #2c3e50;*/
  /*height: 67vh;*/
  /*width: 90vw;*/
  /*margin-left: auto;*/
  /*margin-right: auto;*/
}

#calendriers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

form {
  margin: 2em;
}

table {
  margin: 1em;
  border: 1px #ddd solid;
  box-shadow: #eee 5px 5px 5px;
  border-spacing: 0;
  border-collapse: collapse;
}

tr:hover {
  background: #eee;
}

td,
th {
  padding: 0.5em 1em;
}

th {
  border-bottom: #bbb solid 1px;
  background-color: #ddd;
}

td:nth-child(1),
th:nth-child(1) {
  text-align: left;
}

tr.total {
  background-color: #ddd;
}

.message {
  font-size: 20px;
}

label {
  margin: 1em;
}
</style>
