<template>
  <div id="modulePrerequis" v-if="modulesByFormation && allPrerequis">
    <el-table :data="modulesByFormation" class="prereq" max-height="900" :default-sort="{prop: 'idModule', order: 'descending'}">
      <el-table-column label="Noms des modules" align="center" prop="idModule" width="400" :formatter="formatNomModule" sortable fixed/>
      <el-table-column label="Modules requis" prop="idCours" width="600">
        <template slot-scope="scope">
          <el-select :value="getPrerequisOblById(scope.row.idModule)" filterable @change="setPrerequisObl(scope.row.idModule, $event)" multiple placeholder="Module obligatoire">
            <el-col :span="24">
              <el-option
                v-for="mF in allModuleWithoutObl(scope.row.idModule)"
                :key="mF.idModule"
                :label="mF.libelle"
                :value="mF.idModule">
              </el-option>
            </el-col>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Modules optionnels" prop="idModule" width="600">
        <template slot-scope="scope">
          <el-select :value="getPrerequisOptById(scope.row.idModule)" filterable @change="setPrerequisOpt(scope.row.idModule, $event)" multiple placeholder="Module optionnel">
              <el-option
                v-for="mF in allModuleWithoutOpt(scope.row.idModule)"
                :key="mF.idModule"
                :label="mF.libelle"
                :value="mF.idModule">
              </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
import * as api from '../api'
import reject from 'lodash/reject'

export default {
  name: 'modulePrerequis',
  props: {
    codeFormation: String
  },
  data () {
    return {
      modulesByFormation: null,
      allPrerequis: null,
      test1: [],
      test2: []
    }
  },
  created () {
    this.getModulesByFormation().then(() =>
      this.getAllPrerequis()
    )
  },
  methods: {
    getModulesByFormation () {
      return api.getModulesByCodeFormation(this.codeFormation).then(response => {
        this.modulesByFormation = response.data
      })
    },
    setPrerequisObl (idModule, $event) {
      this.allPrerequis.find(p => p.idModule === idModule).idModuleObligatoire = $event
    },
    setPrerequisOpt (idModule, $event) {
      this.allPrerequis.find(p => p.idModule === idModule).idModuleOpionnel = $event
    },
    getModulePrerequisByFormationAndModule (idModule) {
      api.getModulePrerequisByFormationAndModule(this.codeFormation, idModule)
    },
    getAllPrerequis () {
      return api.getModulesPrerequis().then(response => {
        this.allPrerequis = this.modulesByFormation.map(mod => {
          const prereq = response.data.find(m => m.idModule === mod.idModule)
          return prereq || {idModule: mod.idModule, idModuleObligatoire: [], idModuleOpionnel: [], codeFormation: this.codeFormation}
        })
      })
    },
    getPrerequisOblById (idModule) {
      return this.allPrerequis.find(p => p.idModule === idModule).idModuleObligatoire
    },
    getPrerequisOptById (idModule) {
      return this.allPrerequis.find(p => p.idModule === idModule).idModuleOpionnel
    },
    getModulesLibelle () {
      if (!this.modulesByFormation.length) return []
      const allModules = []

      let currentModule = this.modulesByFormation.shift()

      while (currentModule) {
        allModules.push(currentModule)
        currentModule = this.modulesByFormation.shift()
      }
      return allModules
    },
    formatNomModule (row, col, id) {
      if (!id) return ''
      const modul = this.modulesByFormation.find(mod => mod.idModule === id)
      return modul ? modul.libelle : 'modul inconnu'
    },
    allModuleWithoutOpt (id) {
      const obli = this.allPrerequis.find(p => p.idModule === id).idModuleObligatoire
      return reject(this.modulesByFormation, (mod) => mod.idModule === id || obli.includes(mod.idModule))
    },
    allModuleWithoutObl (id) {
      const opt = this.allPrerequis.find(p => p.idModule === id).idModuleOpionnel
      return reject(this.modulesByFormation, (mod) => mod.idModule === id || opt.includes(mod.idModule))
    }
  }
}
</script>

<style>
.el-input {
  width: 40em;
}
</style>
