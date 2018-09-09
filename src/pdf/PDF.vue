<template>
  <div id="pdf" >
    <el-dialog title="Information supplémentaires" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Niveau du titre">
          <el-select v-model="form.level" placeholder="Sélectioner un niveau">
            <el-option label="Niveau I" value="I"></el-option>
            <el-option label="Niveau II" value="II"></el-option>
            <el-option label="Niveau III" value="III"></el-option>
            <el-option label="Niveau IV" value="IV"></el-option>
            <el-option label="Niveau V" value="V"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Nom de l'étudiant">
          <el-input v-model="form.student" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Nom de l'entreprise">
          <el-input v-model="form.company" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="print">Imprimer</el-button>
      </span>
    </el-dialog>

    <el-alert
      v-if="error"
      title="Erreur !"
      type="error"
      :description="error"
      show-icon
    />

    <div id="pdf-content" v-if="loaded && !error">
      <h1>{{formation.libelleLong}}</h1>
      <h3>
        Préparation au titre de <br />
        &laquo; {{formation.libelleLong}} &raquo;<br />
        Niveau {{form.level}}
      </h3>
      <div class="flex">
        <p>Date de début (formation) : {{calendar.periodOfTraining.start}}</p>
        <p>Date de fin (formation): {{calendar.periodOfTraining.end}}</p>
      </div>
      <p>Formation en centre: {{nbTotalOfHours}} Heures</p>
      <div class="flex">
        <p>Entreprise: {{form.company}}</p>
        <p>Salarié: {{form.student}}</p>
      </div>
      <table id="table">
        <thead>
          <tr>
            <th colspan="2">Dates</th>
            <th rowspan="2" class="bordered">Lieu</th>
            <th rowspan="2" class="bordered" id="program-row">Programme</th>
          </tr>
          <tr>
            <th>Début</th>
            <th>Fin</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="periode in getPeriodes()" :key="periode.idCours">
            <td class="center">{{formatDate(periode.debut)}}</td>
            <td class="center">{{formatDate(periode.fin)}}</td>
            <td :class="getClassLieu(periode)">
              {{formatLieu(periode)}}<br/>
              {{periode.dureeReelleEnHeures ? `${periode.dureeReelleEnHeures} heures` : ''}}
            </td>
            <td>{{formatProgram(periode)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as api from '../api'
import Calendar from '../components/Calendar'
import sumBy from 'lodash/sumBy'
import format from 'date-fns/format'
import getDay from 'date-fns/get_day'
import addDays from 'date-fns/add_days'
import isSameDay from 'date-fns/is_same_day'
import subDays from 'date-fns/sub_days'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import capitalize from 'lodash/capitalize'

window.isSameDay = isSameDay

const getNextWorkingDay = date => {
  const day = getDay(date)
  if (day === 5) return addDays(date, 3)
  if (day === 6) return addDays(date, 2)
  return addDays(date, 1)
}

const getPreviousWorkingDay = date => {
  const day = getDay(date)
  if (day === 1) return subDays(date, 3)
  if (day === 0) return subDays(date, 2)
  return subDays(date, 1)
}

export default {
  name: 'PDF',
  components: { Calendar },
  data () {
    return {
      planningId: null,
      calendar: null,
      modules: null,
      lieux: null,
      loaded: false,
      nbTotalOfHours: 0,
      form: {},
      error: null,
      dialogFormVisible: true
    }
  },
  async created () {
    this.planningId = location.pathname.split('/pdf/')[1]
    if (!this.planningId) this.error = 'Aucun id de planning fourni.'
    await this.loadPlanning()
    if (!this.calendar) this.error = 'Le calendrier demandé est introuvable'
    await this.loadModules()
    await this.loadLieux()
    await this.loadFormation()
    this.loaded = true
  },
  methods: {
    async loadPlanning () {
      const response = await api.getCalendriersById(this.planningId)
      this.calendar = response.data
      this.nbTotalOfHours = sumBy(this.calendar.cours, 'dureeReelleEnHeures')
    },
    async loadModules () {
      const response = await api.getModulesByCodeFormation(this.calendar.codeFormation)
      this.modules = response.data
    },
    async loadLieux () {
      const response = await api.getLieux()
      this.lieux = response.data
    },
    async loadFormation () {
      const response = await api.getFormationById(this.calendar.codeFormation)
      this.formation = response.data
    },
    print () {
      this.dialogFormVisible = false
      setTimeout(print, 500)
    },
    formatDate (date) {
      return format(date, 'DD/MM/YYYY')
    },
    formatLieu ({ codeLieu }) {
      if (!codeLieu) return ''
      const lieu = find(this.lieux, { codeLieu })
      console.log(codeLieu, lieu)
      return lieu ? capitalize(lieu.libelle) : 'Lieu Inconnu'
    },
    formatProgram ({ idModule }) {
      if (!idModule) return 'ENTREPRISE'
      const mod = find(this.modules, { idModule })
      return mod ? mod.libelle : 'Module Inconnu'
    },
    getClassLieu ({ idCours }) {
      return `center ${idCours ? 'with-cours' : ''}`
    },
    getPeriodes () {
      if (!this.calendar.cours.length) return []
      const periodes = []

      const cours = sortBy(this.calendar.cours, 'debut')
      let currentDate = this.calendar.periodOfTraining.start
      let currentCours = cours.shift()

      while (currentCours) {
        if (!isSameDay(currentDate, currentCours.debut)) {
          periodes.push({
            debut: currentDate,
            fin: getPreviousWorkingDay(currentCours.debut)
          })
        }
        periodes.push(currentCours)
        currentDate = getNextWorkingDay(currentCours.fin)
        currentCours = cours.shift()
      }
      if (!isSameDay(currentDate, this.calendar.periodOfTraining.end)) {
        periodes.push({
          debut: currentDate,
          fin: this.calendar.periodOfTraining.end
        })
      }

      console.log(periodes)
      return periodes
    }
  }
}
</script>

<style>
@media print {
  @page {
    size: 210mm 292mm;
  }
}

html, body {
  margin: 0;
  padding: 0;
}

#pdf, #pdf-content {
  width: 100vw;
  height: 100vh;
}

#pdf  .el-table__body-wrapper{
  max-height: auto !important;
  height: 100%;
}

h3, h1, p {
  text-align: center;
  margin: 10px;
}

h1 {
  text-transform: uppercase;
}

h3 {
  margin-bottom: 2em;
}

.flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#table {
  width: 100%;
  border-collapse: collapse;
}

#program-row {
  width: 60%;
}

#table thead {
  background: #ddd;
}

#table, #table td, #table th.bordered {
  border: black solid 1px;
  padding: 5px;
}

.center {
  text-align: center;
}

.with-cours {
  background: #999;
}
</style>
