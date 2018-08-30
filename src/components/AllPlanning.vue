<template>
  <el-row id="allPlannings" :span="24">
    <h1>All planning</h1>
    <el-col :span="24">
      <Calendar v-for="calendar in calendriers" :key="calendar.idCalendrier" :calendrier="calendar" :cours="calendar.cours" :lieux="lieux" :modules="needModules"/>
    </el-col>
  </el-row>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'
import Planning from './Planning'
import Contraintes from './Contrainte'
import Modules from './Module'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'allPlannings',
  components: {Planning, Contraintes, Modules, Calendar},
  data () {
    return {
      calendriers: [],
      lieux: [],
      needModules: [],
      calendrier: Object
    }
  },
  created () {
    this.getCalendrier()
  },
  methods: {
    getCalendrier () {
      api.getCalendriers().then(response => {
        this.calendriers = response.data
      })
    }
  }
}
</script>

<style>
#allPlannings {
  width: 100% !important;
}
</style>
