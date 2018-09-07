<template>
    <el-table
      :data="tableData"
      style="width: 100%"
      height=auto
      >
      <el-table-column
        type="expand"
      >
        <template slot-scope="props">
          <p> Durée en heure : {{ props.row.dureeEnHeures }} heure(s)</p>
          <p> Durée en semaine : {{ props.row.dureeEnSemaines }} semaine(s)</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        sortable
        order
        prop="libelle"
        label="Liste des modules"

        >
      </el-table-column>
      <el-table-column
        label="Operations">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="getInformations(scope.row)">Informations</el-button>
        </template>
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
    },

    getInformations (row) {
      console.log(row)
      this.$router.push('/infoModule/' + row.idModule)
    }
  }
}
</script>
