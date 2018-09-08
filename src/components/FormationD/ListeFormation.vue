<template>
  <el-table
    :data="listeFormation"
    style="width: 100%"
    height=auto
  >
    <el-table-column
      type="expand"
    >
      <template slot-scope="props">
        <p> Formation : {{ props.row.label }}</p>
        <p> Durée : {{ props.row.dureeS }} semaine(s)</p>
        <p> Volume horaire : {{ props.row.dureeH }} heure(s)</p>

      </template>

    </el-table-column>
    <el-table-column
      sortable
      order
      prop="key"
      label="Liste des formations"

    >
    </el-table-column>
    <el-table-column
      label="Operations">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="getInformations(scope.row)">Prérequis</el-button>
      </template>
    </el-table-column>
    <el-table-column>

    </el-table-column>
  </el-table>
</template>

<script>
import axios from 'axios'

export default {
  name: 'listeFormation',

  data () {
    return {
      listeFormation: [],
      listeModule: [],
      listeModuleAllFornations: []
    }
  },

  created () {
    this.getListeFormation()
  },

  methods: {
    getListeFormation () {
      console.log('Début getListeFormation')
      axios
        .get('http://localhost:9000/formations')
        .then(response => {
          this.listeFormation = response.data.map(formation => ({
            key: formation.codeFormation,
            label: formation.libelleLong,
            dureeH: formation.dureeEnHeures,
            dureeS: formation.dureeEnSemaines
          }))
        })
      console.log('Fin getListeFormation')
      return this.listeFormation
    },

    getInformations (row) {
      console.log(row)
      var codeFormation = row.key.replace(/\s/g, '')
      this.$router.push('/infoFormation/' + codeFormation)
    }
  }
}
</script>
