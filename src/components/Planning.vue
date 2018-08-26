<template>
  <el-row id="planning">
      <el-row>
        <el-col :span="24">
          <form action="">
            <el-row>
              <el-col :span="12" class="block">
                      <el-date-picker
                      aria-required="true"
                        v-model="periodeFormation"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        start-placeholder="Début de la formation"
                        end-placeholder="Fin de la formation"
                        firstDayOfWeek="2">
                      </el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" round plain v-on:click="showPlanning()" :loading="loading">Générer</el-button>
              </el-col>
            </el-row>
          </form>
        </el-col>
      </el-row>
      <div v-if="!calendriers.length && loaded && !loading" class="message">
        Aucune solution possible pour les paramètres donnés.
      </div>
      <el-row id="containerCalendriers" v-if="!loading && loaded">
        <el-col :span="12">
          <Calendar v-for="calendar in calendriers" :key="calendar.id" :cours="calendar.cours" :lieux="lieux" :modules="needModules"/>
        </el-col>
        <el-col :span="12">
          <el-tabs tab-position="left">
              <el-tab-pane label="Module de la formation">
                <div v-for="mod in needModules" v-bind:key="mod.idModule">
                  {{ mod.libelleCourt }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="Module hors formation"></el-tab-pane>
            </el-tabs>
        </el-col>
      </el-row>
    </el-row>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'planning',
  data () {
    calendar: Calendar.years()
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
      lieux: [],
      needModules: []
    }
  },

  components: {
    Calendar
  },
  created () {
    this.getLieu()
    this.getModulesFormation()
  },
  methods: {
    showPlanning () {
      this.calendriers = []
      this.loading = true
      const [start, end] = this.periodeFormation
      api.generateCalendar({
        ...this.planning,
        periodOfTraining: { start, end },
        idConstraint: '67b7ef92-af36-41cf-902b-5671a7eb53f5',
        idModulePrerequisPlanning: 'marinaTest1',
        numberOfCalendarToFound: 1
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
              )
            }))
        })
        .catch(err => console.error(err))
        .then(() => {
          this.loaded = true
          this.loading = false
        })
    },
    getLieu () {
      api.getLieux().then(response => {
        this.lieux = response.data
      })
    },
    getModulesFormation () {
      api.getModulesByCodeFormation(this.$route.params.id).then(response => {
        this.needModules = response.data
      })
    }
  }
}
</script>

<style>
#containerModule {
  display: flex;
  order: 1;
  flex-direction: row;
  flex-wrap: wrap;
}

#planning {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#listeModules {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: flex;
  order: 1;
}

#tabCal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

#calendrier {
  width:100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

#containerCalendriers {
  display: flex;
}

form {
  margin: 2em;
}

.message {
  font-size: 20px;
}

label {
  margin: 1em;
}
</style>
