<template>
  <div>
    <el-button type="primary" round plain v-on:click="showPlanning()" :loading="loading">
      Générer
    </el-button>
    <div v-if="!calendriers.length && loaded && !loading" class="message">
      Aucune solution possible pour les paramètres donnés.
    </div>
    <el-row id="containerCalendriers" v-if="!loading && loaded">
      <el-col :span="24">
        <Calendar v-for="calendar in calendriers" :key="calendar.idCalendrier" :calendrier="calendar" :cours="calendar.cours" :lieux="lieux" :modules="needModules"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'

export default {
  name: 'generatePlanning',
  props: {
    lieux: Array,
    needModules: Array,
    periodeFormation: Array,
    codeFormation: String,
    success: Function
  },
  data: () => ({
    calendriers: [],
    loaded: false,
    loading: false
  }),
  methods: {
    showPlanning () {
      this.calendriers = []
      this.loading = true
      const [start, end] = this.periodeFormation
      api.generateCalendar({
        codeFormation: this.codeFormation,
        periodOfTraining: { start, end },
        idConstraint: '67b7ef92-af36-41cf-902b-5671a7eb53f5',
        idModulePrerequisPlanning: 'marinaTest1',
        numberOfCalendarToFound: 5
      })
        .then(response => {
          this.success()
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
    }
  },

  components: {
    Calendar
  }
}
</script>

<style>

</style>
