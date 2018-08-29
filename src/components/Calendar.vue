<template>
  <div>
    <el-col :span="12">
      <el-row>
        <el-table :data="cours" class="calendarGenerate">
          <el-table-column label="Date" align="center" width="100">
            <el-table-column label="Début" align="center" prop="debut" width="100" :formatter="formatDate"/>
            <el-table-column label="Fin" align="center" prop="fin" width="100" :formatter="formatDate"/>
          </el-table-column>
          <el-table-column label="Lieu" align="center" prop="codeLieu" width="200" :formatter="formatLieu"/>
          <el-table-column label="Programme" prop="idModule" :formatter="formatLibelle"/>
        </el-table>
        <el-col :span="2" :offset="11">
          <el-button class="choose" round align="center" v-on:click="choosePlanning()" >Choisir</el-button>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
// import * as api from '../api'
import format from 'date-fns/format'

export default {
  props: {
    cours: { default: () => [], type: Array },
    lieux: { default: () => [], type: Array },
    modules: { default: () => [], type: Array },
    calendrier: { default: () => [], type: Object }
  },
  methods: {
    formatDate (row, col, date) {
      return format(date, 'DD/MM/YYYY')
    },
    formatLieu (row, col, id) {
      const lieu = this.lieux.find(lieu => lieu.codeLieu === id)
      return lieu ? lieu.libelle : 'Lieu inconnu'
    },
    formatLibelle (row, col, id) {
      const m = this.modules.find(m => m.idModule === id)
      return m ? m.libelle : 'Module inconnu'
    },
    choosePlanning() {
      console.log("calendrier : ", this.calendrier)
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
