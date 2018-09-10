<template>
  <div id="modulePrerequis" v-if="modulesByFormation && prerequis">
    <el-table :data="modulesByFormation" class="prereq" max-height="900" :default-sort="{prop: 'libelle', order: 'descending'}">
      <el-table-column label="Noms des modules" align="right" prop="idModule" :formatter="formatNomModule" sortable fixed/>
      <el-table-column label="Modules requis" align="center" prop="idCours">
        <template slot-scope="scope">
          <el-select
            :value="getPrerequisOblById(scope.row.idModule)"
            @change="setPrerequisObl(scope.row.idModule, $event)"
            filterable
            multiple
            placeholder="Module obligatoire"
            :disabled="disabled"
          >
            <el-option
              v-for="mF in allModuleWithoutObl(scope.row.idModule)"
              :key="mF.idModule"
              :label="mF.libelle"
              :value="mF.idModule">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Modules optionnels" align="center" prop="idModule">
        <template slot-scope="scope">
          <el-select
            :value="getPrerequisOptById(scope.row.idModule)"
            @change="setPrerequisOpt(scope.row.idModule, $event)"
            filterable
            multiple
            placeholder="Module optionnel"
            :disabled="disabled"
          >
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
    codeFormation: String,
    setModulePrerequis: {type: Function, default: () => {}},
    idModulePrerequisPlanning: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modulesByFormation: null,
      test1: [],
      test2: [],
      prerequisPlanning: null,
      prerequis: null
    }
  },
  created () {
    this.getModulesByFormation()
  },
  watch: {
    idModulePrerequisPlanning (id) {
      this.getPrerequisPlanning(id)
    }
  },
  methods: {
    async getPrerequisPlanning (id) {
      if (!id) return
      const { data: prerequisPlanning } = await api.getModulesPrerequisPlanningById(id)
      this.prerequisPlanning = prerequisPlanning
      const { data: allPrerequis } = await api.getModulesPrerequis()
      const prerequis = allPrerequis.filter(p => this.prerequisPlanning.idModulePrerequis.includes(p.idModulePrerequis))
      this.prerequis = this.modulesByFormation.map(mod => {
        const prereq = prerequis.find(m => m.idModule === mod.idModule)
        return prereq || {idModule: mod.idModule, idModuleObligatoire: [], idModuleOptionnel: [], codeFormation: this.codeFormation}
      })
      this.setModulePrerequis(this.modulesByFormation)
      this.disabled = true
    },
    async getModulesByFormation () {
      const response = await api.getModulesByCodeFormation(this.codeFormation)
      this.modulesByFormation = response.data
      this.prerequis = this.modulesByFormation.map(mod => {
        return {idModule: mod.idModule, idModuleObligatoire: [], idModuleOptionnel: [], codeFormation: this.codeFormation}
      })
      this.setModulePrerequis(this.prerequis)
    },
    setPrerequisObl (idModule, $event) {
      this.prerequis.find(p => p.idModule === idModule).idModuleObligatoire = $event
    },
    setPrerequisOpt (idModule, $event) {
      this.prerequis.find(p => p.idModule === idModule).idModuleOptionnel = $event
    },
    getPrerequisOblById (idModule) {
      return this.prerequis.find(p => p.idModule === idModule).idModuleObligatoire
    },
    getPrerequisOptById (idModule) {
      return this.prerequis.find(p => p.idModule === idModule).idModuleOptionnel
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
      const obli = this.prerequis.find(p => p.idModule === id).idModuleObligatoire
      return reject(this.modulesByFormation, (mod) => mod.idModule === id || obli.includes(mod.idModule))
    },
    allModuleWithoutObl (id) {
      const opt = this.prerequis.find(p => p.idModule === id).idModuleOptionnel
      return reject(this.modulesByFormation, (mod) => mod.idModule === id || opt.includes(mod.idModule))
    }
  }
}
</script>

<style>
.el-table__row .cell {
  padding: 0 !important;
}
</style>
