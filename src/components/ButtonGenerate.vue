<template>
    <el-button type="primary" round plain v-on:click="showPlanning()" :loading="loading">
      Générer
    </el-button>
</template>

<script>
import * as api from '../api'
export default {
  name: 'buttonGenerate',
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
  }
}
</script>

<style>

</style>
