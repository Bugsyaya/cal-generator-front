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
<!--        <p> Index : {{ props.$index }}</p>

        <el-table
          :data="listeModuleAllFornations">
          <el-table-column
            prop="label"
            label="Liste des modules dans la formation"
          >
            <template slot-scope="prop">
              <p> {{ prop.row.get($index) }}</p>
&lt;!&ndash;              <p v-for="mod in props.row" v-bind="mod.key">
                {{ mod.label }}

              </p>&ndash;&gt;
            </template>
          </el-table-column>
        </el-table>-->

      </template>

    </el-table-column>
    <el-table-column
      fixed
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
          @click="getInformations(scope.row)">Informations</el-button>
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
    /*      this.getListeModuleAllFormations() */
  },

  methods: {
    getListeFormation () {
      console.log('Début getListeFormation')
      api.getFormations()
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

    /* getListeModuleAllFormations () {
        console.log('Début getListeModuleAllFormations')
        if (this.listeFormation.length != 0) {
          for (var index = 0; index < this.listeFormation.length; index++) {
            var codeFormation = this.listeFormation[index].key
            console.log('FDS##### :', codeFormation)
            var codeFormationPropre = codeFormation.replace(/\s/g, '')
            axios
              .get('http://localhost:9000/formations/' + codeFormationPropre + '/modules')
              .then(response => {
                this.listeModuleAllFornations.push(response.data.map(module => ({
                  key: module.idModule,
                  label: module.libelle,
                  dureeH: module.dureeEnHeures,
                  dureeS: module.dureeEnSemaines
                })))
          })}

        } else {
          console.log("Timeout")
          setTimeout(this.getListeModuleAllFormations,500);
        }
        console.log('Fin getListeModuleAllFormation')
      } */
  }
}
</script>
