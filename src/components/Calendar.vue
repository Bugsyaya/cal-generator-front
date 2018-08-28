<template>
  <el-table :data="cours">
    <el-table-column label="Date" align="center" width="100">
      <el-table-column label="Début" align="center" prop="debut" width="100" :formatter="formatDate"/>
      <el-table-column label="Fin" align="center" prop="fin" width="100" :formatter="formatDate"/>
    </el-table-column>
    <el-table-column label="Lieu" align="center" prop="codeLieu" width="200" :formatter="formatLieu"/>
    <el-table-column label="Programme" prop="idModule" :formatter="formatLibelle"/>
  </el-table>
</template>

<script>
// import * as api from '../api'
import format from 'date-fns/format'

export default {
  props: {
    cours: { default: () => [], type: Array },
    lieux: { default: () => [], type: Array },
    modules: { default: () => [], type: Array }
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
    }
  }
}
</script>

<style>
</style>
