<template>
  <el-collapse id="collapse">
    <el-collapse-item v-for="modPrerequisPlanning in this.modulePrerequisPlanning"
                      v-bind:key="modPrerequisPlanning.idModulePrerequisPlanning"
                      :title="modPrerequisPlanning.titre"
                      :name="modPrerequisPlanning.titre">
      <el-button @click="handleChoice(modPrerequisPlanning.idModulePrerequisPlanning)">Choisir</el-button>

      <div v-for="modPrereq in modulePrerequis"
           v-bind:key="modPrereq.idModulePrerequis">
        {{ modPrereq.titre}}
        <div v-if="modPrereq.idModuleObligatoire.length">
          <p>
            Modules obligatoires :
          </p>
          <ul v-for="obli in modPrereq.idModuleObligatoire" v-bind:key="obli" class="mod">
            <li>
              {{ getModuleTitre(obli).libelle }}
            </li>
          </ul>
        </div>
        <div v-if="modPrereq.idModuleOptionnel.length">
          <p>
            Modules optionnels :
          </p>
          <ul v-for="opt in modPrereq.idModuleOptionnel" v-bind:key="opt" class="mod">
            <li>
              {{ getModuleTitre(opt).libelle }}
            </li>
          </ul>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import * as api from '../api'

export default {
  name: 'listePrerequis',
  props: {
    setIdPrerequisPlanning: Function
  },
  data () {
    return {
      modulePrerequisPlanning: [],
      modulePrerequis: [],
      allModules: []
    }
  },
  created () {
    this.getModPrerequis().then(() =>
      this.getModPrerequisPlanning()
    ).then(() =>
      this.getModules()
    )
  },
  methods: {
    getModPrerequis () {
      return api.getModulesPrerequis().then(response => {
        this.modulePrerequis = response.data
      })
    },
    getModPrerequisPlanning () {
      return api.getModulesPrerequisPlanning().then(response => {
        this.modulePrerequisPlanning = response.data
      })
    },
    getModules () {
      return api.getModules().then(response => {
        this.allModules = response.data
      })
    },
    getModuleTitre (idModule) {
      return this.allModules.find(mod => mod.idModule === idModule) || {libelle: 'Module inconnu'}
    },
    handleChoice (idPrerequisPlanning) {
      this.setIdPrerequisPlanning(idPrerequisPlanning)
    }
  }

}
</script>

<style>
.mod {
  margin-bottom: 0em !important;
}
</style>
