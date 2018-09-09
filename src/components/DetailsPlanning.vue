<template>
  <div id="detailsPlannings">
    <el-col :span="2" align="right">
      <el-button type="primary" round plain v-on:click="printCalendar()">
        Télécharger
      </el-button>
    </el-col>
    <el-col :span="2" :offset="1" align="center">
      <el-button type="primary" round plain v-on:click="verifierCalendar()">
        Vérifier
      </el-button>
    </el-col>
    <el-col :span="2" :offset="1">
      <el-button type="primary" round plain v-on:click="updateCalendar()">
        Sauvegarder
      </el-button>
    </el-col>
    <el-col :span="2" :offset="1">
      <el-button type="primary" round plain v-on:click="newCalendar()">
        Nouveau calendrier
      </el-button>
    </el-col>
      <el-col :span="13" class="dCalendar">
        <div v-if="this.isAlerted">
          <el-alert
            id="calAlerte"
            title="Des changements ont été détectés depuis la génération de ce planning"
            type="error"
            description="more text description"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
        <Calendar :calendrier="calendar" :lieux="lieux" :modules="needModules" :calendrierVerifier="calendrierVerifier"/>
      </el-col>
      <el-col :span="11" class="dCalendar">
        <el-tabs :tab-position="tabPosition">
            <el-tab-pane label="Modules liés à la formation">
              <el-input
                placeholder="Mot clef à filtrer"
                v-model="filterText">
              </el-input>
              <el-tree
                :data="dataModuleFormation"
                show-checkbox
                :filter-node-method="filterNode"
                :default-checked-keys="checkedBox"
                @check-change="handleModuleFormationChange"
                node-key="coursId"
                ref="moduleFormation"
              />
            </el-tab-pane>
          <el-tab-pane label="Modules hors formation">
            <el-input
              placeholder="Mot clef à filtrer"
              v-model="filterTextHors">
            </el-input>
            <el-tree
              :data="dataModuleHorsFormation"
              show-checkbox
              :filter-node-method="filterNode"
              :default-checked-keys="checkedBox"
              node-key="coursId"
              ref="moduleHorsFormation"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
  </div>
</template>

<script>
import Calendar from './Calendar'
import * as api from '../api'
import * as JsPDF from 'jspdf'
import format from 'date-fns/format'
import includes from 'lodash/includes'
import toUpper from 'lodash/toUpper'
import flatMap from 'lodash/flatMap'
import findIndex from 'lodash/findIndex'

export default {
  name: 'detailsPlannings',
  props: {
    setStepNumber: Function,
    getStepNumber: Function,
    needModules: Array,
    lieux: Array,
    setTitle: Function,
    getTitle: Function,
    setDescription: Function,
    setIdConstraint: Function,
    idModulePrerequisPlanning: String,
    setIdModulePrerequisPlanning: {type: Function, default: () => {}},
    isDisabled: Boolean,
    setIsDisabled: Function
  },
  watch: {
    filterText (val) {
      this.$refs.moduleFormation.filter(val)
    },
    filterTextHors (val) {
      this.$refs.moduleHorsFormation.filter(val)
    }
  },
  data () {
    return {
      calendar: {},
      tabPosition: 'left',
      dataModuleFormation: [],
      modulesFormation: [],
      modulesHorsFormation: [],
      dataModuleHorsFormation: [],
      filterText: '',
      filterTextHors: '',
      checkedBox: [],
      calendrierVerifier: null,
      isAlerted: false,
      allNbStagiaireByCours: [],
      coursByModule: {}
    }
  },

  components: {
    Calendar
  },
  created () {
    this.getCalendrier().then(() =>
      this.getNbStagiaireByCours()
    ).then(() =>
      this.moduleByFormation()
    ).then(() =>
      this.checkBox()
    ).then(() =>
      this.moduleHorsFormation()
    )
  },
  methods: {
    newCalendar () {
      const uuidv1 = require('uuid/v1')
      const newId = uuidv1()
      console.log(this.calendar)
      const newCalendar = {
        ...this.calendar,
        idCalendrier: newId,
        status: 'created',
        titre: this.calendar.titre + ' - copie',
        description: this.calendar.description + ' - copie'
      }
      api.saveCal(newCalendar).then(response => {
        this.$router.push('/planning/' + newCalendar.codeFormation + '/details/' + newId)
      })
    },
    updateCalendar () {
      api.updateCalendar(this.calendar).then(response => {

      })
    },
    getNbStagiaireByCours () {
      return api.getNbStagiaireByCours().then(response => {
        this.allNbStagiaireByCours = response.data
      })
    },
    findNbStagiaireByCours (idCours) {
      if (!idCours) return ''
      const cours = this.allNbStagiaireByCours.find(nbStagiaireByCours => nbStagiaireByCours.idCours === idCours)
      return cours ? cours.nbStagiaire : 0
    },
    verifierCalendar () {
      api.updateCalendar(this.calendar).then(response => {
        api.verifierCalendar(this.calendar.idCalendrier).then(response => {
          this.calendrierVerifier = response.data
          this.setStepNumber(3)
        })
      })
    },
    checkBox () {
      const coursIds = this.calendar.cours.map(cours => cours.idCours)
      this.checkedBox = flatMap(this.dataModuleFormation, 'children')
        .filter(item => coursIds.includes(item.coursId))
        .map(item => item.coursId)
      this.$refs.moduleFormation.setChecked(this.checkedBox, true)
    },
    async moduleByFormation () {
      const { data: modules } = await api.getModulesByCodeFormation(this.calendar.codeFormation)
      this.modulesFormation = modules
      await Promise.all(this.modulesFormation.map(async m => {
        const { data } = await api.getCoursByModules(m.idModule)
        this.coursByModule[m.idModule] = data
      }))
      this.dataModuleFormation = modules.map(m => ({
        id: m.idModule,
        label: m.libelle,
        children: this.coursByModule[m.idModule].map(cours => ({
          id: cours.idCours,
          label: `${format(cours.debut, 'DD/MM/YYYY')} - ${format(cours.fin, 'DD/MM/YYYY')} (${toUpper(this.lieux.filter(li => li.codeLieu === cours.codeLieu).map(li => li.libelle)[0])}) : ${this.findNbStagiaireByCours(cours.idCours)}`,
          moduleTitle: m.libelle,
          coursId: cours.idCours,
          idModule: m.idModule
        }))
      }))
    },
    async moduleHorsFormation () {
      const { data: modules } = await api.getModulesHorsCodeFormation(this.calendar.codeFormation)
      this.dataModuleHorsFormation = await Promise.all(modules.map(async m => ({
        id: m.idModule,
        label: m.libelle,
        children: (await api.getCoursByModules(m.idModule)).data.map(cours => ({
          id: cours.idCours,
          label: `${format(cours.debut, 'DD/MM/YYYY')} - ${format(cours.fin, 'DD/MM/YYYY')} (${toUpper(this.lieux.filter(li => li.codeLieu === cours.codeLieu).map(li => li.libelle)[0])}) : ${this.findNbStagiaireByCours(cours.idCours)}`,
          moduleTitle: m.libelle,
          coursId: cours.idCours,
          idModule: m.idModule
        }))
      })))
    },
    filterNode (value, data) {
      if (!value) return true
      return includes(toUpper(data.label), toUpper(value)) || includes(toUpper(data.moduleTitle), toUpper(value))
    },
    getCalendrier () {
      return api.getCalendriersById(this.$route.params.idCalendar).then(response => {
        this.calendar = response.data
        this.isAlerted = false
        if (this.calendar.status === 'created') this.setStepNumber(2)
        else if (this.calendar.status === 'checked' || this.calendar.status === 'alerte') this.setStepNumber(3)
        else if (this.calendar.status === 'telecharger') this.setStepNumber(4)
        else this.setStepNumber(0)

        if (this.calendar.status === 'alerte') this.isAlerted = true
        this.setIdModulePrerequisPlanning(this.calendar.idModulePrerequisPlanning)

        this.setTitle(this.calendar.titre)
        this.setDescription(this.calendar.description)
        this.setIdConstraint(this.calendar.constraint && this.calendar.constraint.idConstraint)
      })
    },
    printCalendar () {
      var doc = new JsPDF()
      var source = window.document.getElementById('detailsPlannings')
      doc.fromHTML(
        source,
        15,
        15,
        {
          'width': 180
        })
      doc.save('two-by-four.pdf')
      this.setStepNumber(4)
    },
    handleModuleFormationChange ({coursId, idModule}, checked) {
      if (!this.calendar || !this.dataModuleFormation || !coursId) return
      if (checked) {
        const cours = this.coursByModule[idModule].find(c => c.idCours === coursId)
        api.incrementCours(coursId).then(response => {
          console.log(response.data)
          this.calendar.cours.push({...cours, constraints: []})
        })
      } else {
        const coursIndex = findIndex(this.calendar.cours, { idCours: coursId })
        api.dincrementCours(coursId).then(response => {
          console.log(response.data)
          this.calendar.cours.splice(coursIndex, 1)
        })
      }
    }
  }
}
</script>

<style>
.dCalendar {
  margin-top: 2em;
  max-height: 750px;
}

.dCalendar .el-tree {
  height: 750px;
  overflow: auto;
}

#calAlerte{
  margin-bottom: 1em;
}
</style>