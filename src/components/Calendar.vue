<template>
  <div>
        <el-table :data="getPeriods()" class="calendarG" v-if="calendrier.cours" max-height="750" :row-class-name="tableRowClassName">
          <el-table-column label="Date" align="center" width="100">
            <el-table-column label="Début" align="center" prop="debut" width="100" :formatter="formatDate"/>
            <el-table-column label="Fin" align="center" prop="fin" width="100" :formatter="formatDate"/>
          </el-table-column>
          <el-table-column label="Lieu" align="center" prop="codeLieu" width="150" :formatter="formatLieu"/>
          <el-table-column label="Classe" align="center" prop="idCours" width="180"/>
          <el-table-column label="Programme" prop="idModule" :formatter="formatLibelle"/>
        </el-table>
  </div>
</template>

<script>
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
    calendrier: { type: Object },
    calendrierVerifier: { type: Object }
  },
  methods: {
    formatDate (row, col, date) {
      return format(date, 'DD/MM/YYYY')
    },
    formatLieu (row, col, id) {
      if (!id) return ''
      const lieu = this.lieux.find(lieu => lieu.codeLieu === id)
      return lieu ? lieu.libelle : 'Lieu inconnu'
    },
    formatLibelle (row, col, id) {
      if (!id) return 'Période Entreprise'
      const m = this.modules.find(m => m.idModule === id)
      return m ? `${m.libelle}` : 'Module inconnu'
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
    },
    tableRowClassName ({row, rowIndex}) {
      console.log('calenV :', this.calendrierVerifier)
      if (rowIndex === 2) return 'warning-row'
      else if (rowIndex === 3) return 'success-row'
      return ''
    }
  }
}
</script>

<style>
.el-calendarG > .el-col {
  margin-left: 1em !important;
}

.choose {
  margin: 1em !important;
  margin-bottom: 2em !important;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
