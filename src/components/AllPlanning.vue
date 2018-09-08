<template>
  <el-row id="allPlannings" :span="24">
    <h1>Liste des derniers calendriers créés</h1>
    <el-col :span="24">
        <div v-for="calendar in calendriers" :key="calendar.idCalendrier">
            <el-col :span="12">
              <div class="infoCal">
                <el-col :span="20">
                  <p>[{{ calendar.codeFormation }}] {{ calendar.titre }} - {{ calendar.description }}</p>
                </el-col>
                <el-col :span="4">
                  <el-tag :type=statusCal(calendar.status)>{{ calendar.status}}</el-tag>
                </el-col>
              </div>
              <Calendar class="calendarGenerate" :key="calendar.idCalendrier" :calendrier="calendar" :cours="calendar.cours" :lieux="lieux" :modules="needModules"/>
              <MoreInfoCal id="moreInfoCal" :titleAndDescNeeded="false" :calendrier="calendar" />
            </el-col>
        </div>
    </el-col>
  </el-row>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'
import Planning from './Planning'
import Contraintes from './Contrainte'
import Modules from './Module'
import MoreInfoCal from './MoreInfoCal'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'allPlannings',
  components: {Planning, Contraintes, Modules, Calendar, MoreInfoCal},
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
    this.getLieu()
    this.getModule()
  },
  methods: {
    getCalendrier () {
      api.getCalendriers().then(response => {
        this.calendriers = response.data
      })
    },
    statusCal (status) {
      if (status === 'created') return 'success'
      else if (status === 'checked') return 'warning'
      else if (status === 'alerte') return 'danger'
      else return 'info'
    },
    getLieu () {
      api.getLieux().then(response => {
        this.lieux = response.data
      })
    },
    getModule () {
      api.getModules().then(response => {
        this.needModules = response.data
      })
    }
  }
}
</script>

<style>
#allPlannings {
  width: 100% !important;
}

.calendarGenerate {
  width: 95%;
  padding-top: 3em;
}

h1 {
  padding-bottom: 2em;
}
</style>
