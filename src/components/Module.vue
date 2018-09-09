<template>
  <el-transfer>
    filterable
    filter-placeholder="Libellé du module"
    :titles="['Modules', 'Nécessite']"
    v-model="selectedModules"
    :data="modules">
  </el-transfer>
</template>

<script>
import * as api from '../api'
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
      api.getModules().then(response => {
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

  #module {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
