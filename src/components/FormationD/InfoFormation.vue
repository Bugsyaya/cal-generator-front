<template>
  <div id="infoFormation">
    <el-col :span="24" class="top">
      <el-col :span="4">
        <el-button icon="el-icon-arrow-left" @click="goBack()"/>
      </el-col>
      <el-col :span="20">
        <h1>
          Gestion des modules prérequis pour la formation {{ this.$route.params.id }}
        </h1>
      </el-col>
    </el-col>

    <el-col :span="22" :offset="1">
      <PrerequisModule :codeFormation="this.$route.params.id" :setModulePrerequis="setModulePrerequis"/>
      <MoreInfoCal id="moreInfoCal"
                  buttonName="Sauvegarder"
                  :titleAndDescNeeded=true
                  :needRedirection=false
                  :titrePopUp="titrePopUp"
                  messageSuccess="Les prerequis ont bien été sauvegardés"
                  messageError="Une erreur s'est produite"
                  :saveFunction="savePrerequisPlanning"
                  :setTitre="setTitre"
                  :setDescription="setDescription"
                  />
    </el-col>
  </div>
</template>

<script>
import * as api from '../../api'
import PrerequisModule from '../PrerequisModule'
import MoreInfoCal from '../MoreInfoCal'

export default {
  name: 'InfoFormation',
  components: {
    PrerequisModule, MoreInfoCal
  },
  data () {
    return {
      titrePopUp: `Création des prérequis pour la formation ${this.$route.params.id}`,
      allModules: [],
      modulePrerequis: null,
      allPrerequis: [],
      tablePrerequis: [],
      prerequisForFormation: [],
      tableFormation: [],
      tableFormationComplet: [],
      load: false,
      success: false,
      typeAlert: null,
      tittleAlert: null,
      description: '',
      titre: ''
    }
  },

  created () {
    this.getModul()
  },
  methods: {
    getModul () {
      api.getModules().then(response => {
        this.allModules = response.data
      })
    },
    setModulePrerequis (modulePrerequis) {
      this.modulePrerequis = modulePrerequis
    },
    getModulePrerequis () {
      return this.modulePrerequis
    },
    setTitre (titre) {
      this.titre = titre
    },
    setDescription (description) {
      this.description = description
    },
    savePrerequisPlanning () {
      return Promise.all(this.modulePrerequis.filter(modPrerequis => modPrerequis.idModuleObligatoire.length || modPrerequis.idModuleOptionnel.length).map(modPrerequis => {
        const moduleName = this.allModules.find(m => m.idModule === modPrerequis.idModule).libelle
        const uuidv1 = require('uuid/v1')
        return api.createModulesPrerequis({
          ...modPrerequis,
          idModulePrerequis: uuidv1(),
          codeFormation: this.$route.params.id,
          titre: `Prérequis du module ${moduleName}`,
          description: `Prérequis du module ${moduleName} pour la formation ${this.$route.params.id}`
        })
      })).then(responses => {
        const uuidv1 = require('uuid/v1')
        return api.createModulesPrerequisPlanning({
          idModulePrerequisPlanning: uuidv1(),
          idModulePrerequis: responses.map(response => response.data.idModulePrerequis),
          titre: '',
          description: '',
          codeFormation: this.$route.params.id
        })
      })
    },
    goBack () {
      this.$router.push('/listeFormation/')
    }
  }
}
</script>

<style>
#infoFormation {
  width: 100%;
}

#modulePrerequis {
  margin-bottom: 2em;
}

.saveBtn, .top {
  margin-top: 1em;
}
</style>
