<template>
  <el-table
    :data="listeFormation"
    style="width: 100%"
    height=auto>
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
          @click="getInformations(scope.row)">Prérequis
          </el-button>
        <el-button
          size="mini"
          @click="generate(scope.row)">Générer
          </el-button>
      </template>
    </el-table-column>
    <el-table-column>

    </el-table-column>
  </el-table>
</template>

<script>
import * as api from '../../api'

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
      api.getFormations().then(response => {
        this.listeFormation = response.data.map(formation => ({
          key: formation.codeFormation,
          label: formation.libelleLong,
          dureeH: formation.dureeEnHeures,
          dureeS: formation.dureeEnSemaines
        }))
      })
      return this.listeFormation
    },
    generate (row) {
      var codeFormation = row.key.replace(/\s/g, '')
      this.$router.push('/planning/' + codeFormation)
    },

    getInformations (row) {
      var codeFormation = row.key.replace(/\s/g, '')
      this.$router.push('/infoFormation/' + codeFormation)
    }
  }
}
</script>
