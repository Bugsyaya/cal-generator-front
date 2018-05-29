<template>
  <el-transfer
    filterable
    filter-placeholder="Libellé du module"
    :titles="['Modules', 'Nécessite']"
    v-model="selectedModules"
    :data="modules">
  </el-transfer>
</template>

<script>
import axios from 'axios'
export default {

  data () {
    return {
      modules: [],
      selectedModules: []
    }
  },
  created () {
    this.getModules()
  },
  methods: {
    getModules () {
      axios.get('http://localhost:9000/modules').then(response => {
        this.modules = response.data.map(module => ({key: module.idModule, label: module.libelleCourt}))
      })
    }
  }
}
</script>

<style>
  .el-transfer-panel {
    width: auto !important;
  }
  .el-transfer-panel__item {
    /* padding: 1em !important; */
    margin-left: 0em !important;
  }
</style>
