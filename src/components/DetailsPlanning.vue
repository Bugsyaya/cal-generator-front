<template>
  <div id="detailsPlannings">
    <Calendar :key="calendar.idCalendrier" :calendrier="calendar" :lieux="lieux" :modules="needModules"/>
  </div>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'

export default {
  name: 'detailsPlannings',
  props: {
    needModules: Array
  },
  data () {
    return {
      lieux: [],
      calendar: Object
    }
  },

  components: {
    Calendar
  },
  created () {
    this.getCalendrier()
  },
  methods: {
    getCalendrier () {
      api.getCalendriersById(this.$route.params.idCalendar).then(response => {
        this.calendar = response.data
      })
    }
  }

}
</script>

<style>

</style>
