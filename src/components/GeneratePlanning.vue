<template>
  <div>
    <div v-if="!calendriers.length && loaded && !loading" class="message">
      Aucune solution possible pour les paramètres donnés.
    </div>
    <el-row id="containerCalendriers" v-if="!loading && loaded">
      <el-col v-if="getStepNumber > 1" :span="18">
        <Calendar v-for="calendar in calendriers" :key="calendar.idCalendrier" :cours="calendar.cours" :lieux="lieux" :modules="needModules"/>
      </el-col>
      <el-col v-else :span="24">
        <Calendar v-for="calendar in calendriers" :key="calendar.idCalendrier" :calendrier="calendar" :cours="calendar.cours" :lieux="lieux" :modules="needModules"/>
      </el-col>
      <el-col v-if="getStepNumber > 1" :span="6">
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
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import axios from 'axios'

export default {
  name: 'generatePlanning',
  props: {
    calendriers: Array
  },
  data: () => ({

  }),
  methods: {

  },

  components: {
  }
}
</script>

<style>

</style>
