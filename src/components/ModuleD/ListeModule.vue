<template>
  <el-table
    id="listeModule"
    :data="tableData">
    <el-table-column
      type="expand">
      <template slot-scope="props">
        <p> Durée en heure : {{ props.row.dureeEnHeures }} heure(s)</p>
        <p> Durée en semaine : {{ props.row.dureeEnSemaines }} semaine(s)</p>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      order
      prop="libelle"
      label="Liste des modules"
      >
    </el-table-column>
  </el-table>
</template>

<script>
import * as api from '../../api'

export default {
  name: 'ListeModule',

  data () {
    return {
      tableData: [],
      loaded: false,
      loading: false
    }
  },
  created () {
    this.getListeModule()
  },
  methods: {
    getListeModule () {
      this.loading = true
      api.getModules()
        .then(response => {
          this.tableData = response.data
          console.log('test3', this.tableData)
        })
      this.loaded = true
      this.loading = false
    }
  }
}
</script>

<style>
#listeModule {
  max-height: 95vh;
  overflow: auto;
}
</style>
