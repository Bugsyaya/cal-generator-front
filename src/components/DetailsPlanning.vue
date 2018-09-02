<template>
  <div id="detailsPlannings">
    <el-button type="primary" round plain v-on:click="printCalendar()">
      Télécharger
    </el-button>
    <Calendar :key="calendar.idCalendrier" :calendrier="calendar" :lieux="lieux" :modules="needModules"/>
  </div>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'
import * as JsPDF from 'jspdf'

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
    },
    printCalendar () {
      var doc = new JsPDF()
      var source = window.document.getElementById('detailsPlannings')
      doc.fromHTML(
        source,
        15,
        15,
        {
          'width': 180
        })
      doc.save('two-by-four.pdf')
    }
  }
}
</script>

<style>

</style>
