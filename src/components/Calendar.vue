<template>
  <div>
    <el-col :span="12">
      <el-row>
        <el-table :data="getPeriods()" class="calendarGenerate">
          <el-table-column label="Date" align="center" width="100">
            <el-table-column label="Début" align="center" prop="debut" width="100" :formatter="formatDate"/>
            <el-table-column label="Fin" align="center" prop="fin" width="100" :formatter="formatDate"/>
          </el-table-column>
          <el-table-column label="Lieu" align="center" prop="codeLieu" width="200" :formatter="formatLieu"/>
          <el-table-column label="Programme" prop="idModule" :formatter="formatLibelle"/>
        </el-table>
        <el-col :span="2" :offset="11">
          <el-button class="choose" round align="center" v-on:click="choosePlanning()">Choisir</el-button>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
// import * as api from '../api'
import locale from 'date-fns/locale/fr'
import format from 'date-fns/format'
import getDay from 'date-fns/get_day'
import addDays from 'date-fns/add_days'
import isSameDay from 'date-fns/is_same_day'
import subDays from 'date-fns/sub_days'
import sortBy from 'lodash/sortBy'

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
  props: {
    lieux: { default: () => [], type: Array },
    modules: { default: () => [], type: Array },
    calendrier: { default: () => [], type: Object }
  },
  methods: {
    formatDate (row, col, date) {
      return format(date, 'ddd DD/MM/YYYY', {locale})
    },
    formatLieu (row, col, id) {
      if (!id) return ''
      const lieu = this.lieux.find(lieu => lieu.codeLieu === id)
      return lieu ? lieu.libelle : 'Lieu inconnu'
    },
    formatLibelle (row, col, id) {
      if (!id) return 'Période Entreprise'
      const m = this.modules.find(m => m.idModule === id)
      return m ? m.libelle : 'Module inconnu'
    },
    choosePlanning () {
      console.log('calendrier : ', this.calendrier)
    },
    getPeriods () {
      if (!this.calendrier.cours.length) return []
      const periodes = []

      const cours = sortBy(this.calendrier.cours, 'debut')
      let currentDate = this.calendrier.periodOfTraining.start
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
      if (!isSameDay(currentDate, this.calendrier.periodOfTraining.end)) {
        periodes.push({
          debut: currentDate,
          fin: this.calendrier.periodOfTraining.end
        })
      }

      return periodes
    }
  }
}
</script>

<style>
.calendarGenerate {
  width: 95%;
}

.el-calendarGenerate > .el-col {
  margin-left: 1em !important;
}

.choose {
  margin: 1em !important;
  margin-bottom: 2em !important;
}
</style>
