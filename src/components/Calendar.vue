<template>
  <div>
    <el-col :span="12">
      <el-row>
        <el-table :data="getPeriods()" class="calendarGenerate">
          <el-table-column label="Date" align="center" width="100">
            <el-table-column label="Début" align="center" prop="debut" width="100" :formatter="formatDate"/>
            <el-table-column label="Fin" align="center" prop="fin" width="100" :formatter="formatDate"/>
          </el-table-column>
          <el-table-column label="Lieu" align="center" prop="codeLieu" width="150" :formatter="formatLieu"/>
          <el-table-column label="Classe" align="center" prop="idCours" width="180"/>
          <el-table-column label="Programme" prop="idModule" :formatter="formatLibelle"/>
        </el-table>
        <el-col :span="2" :offset="11">
          <el-button class="choose" round align="center" @click="dialogFormVisible = true">Choisir</el-button>
        </el-col>
      </el-row>
    </el-col>

    <el-dialog title="Information du planning" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" >
        <el-form-item label="Titre" prop="titre" :label-width="formLabelWidth">
          <el-input v-model="form.titre" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description" :label-width="formLabelWidth">
          <el-input v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="submitForm('form')">Cancel</el-button>
        <el-button type="primary" v-on:click="submitForm('form')">Confirm</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import * as api from '../api'
import locale from 'date-fns/locale/fr'
import format from 'date-fns/format'
import getDay from 'date-fns/get_day'
import addDays from 'date-fns/add_days'
import isSameDay from 'date-fns/is_same_day'
import subDays from 'date-fns/sub_days'
import sortBy from 'lodash/sortBy'
import omit from 'lodash/omit'

window.isSameDay = isSameDay

const getNextWorkingDay = date => {
  const day = getDay(date)
  if (day === 5) return addDays(date, 3)
  if (day === 6) return addDays(date, 2)
  return addDays(date, 1)
}

const getPreviousWorkingDay = date => {
  const day = getDay(date)
  if (day === 1) return subDays(date, 3)
  if (day === 0) return subDays(date, 2)
  return subDays(date, 1)
}

export default {
  props: {
    lieux: { default: () => [], type: Array },
    modules: { default: () => [], type: Array },
    calendrier: { default: () => [], type: Object }
  },
  data () {
    return {
      dialogFormVisible: false,
      form: {
        titre: '',
        description: ''
      },
      formLabelWidth: '120px',
      rules: {
        titre: [
          { required: true, message: 'Merci de renseigner un titre', trigger: 'blur' },
          { min: 3, max: 200, message: 'Le titre doit avoir entre 3 et 200 caractères', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Merci de renseigner une description', trigger: 'blur' },
          { min: 3, max: 200, message: 'La description doit avoir entre 3 et 200 caractères', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.choosePlanning()
        } else {
          return false
        }
      })
    },
    success () {
      this.$notify({
        title: 'Sauvegarder',
        message: 'Le calendrier a correctement été enregistré',
        type: 'success'
      })
    },
    error () {
      this.$notify({
        title: 'Erreur',
        message: 'Une erreur s\'est produite',
        type: 'error'
      })
    },
    formatDate (row, col, date) {
      return format(date, 'ddd DD/MM/YYYY', {locale})
    },
    formatLieu (row, col, id) {
      if (!id) return ''
      const lieu = this.lieux.find(lieu => lieu.codeLieu === id)
      return lieu ? lieu.libelle : 'Lieu inconnu'
    },
    formatLibelle (row, col, id) {
      if (!id) return 'Période Entreprise'
      const m = this.modules.find(m => m.idModule === id)
      return m ? `${m.libelle}` : 'Module inconnu'
    },
    choosePlanning () {
      this.dialogFormVisible = false
      const calendrier = {
        ...omit(this.calendrier, ['id', 'nbTotalHeures']),
        titre: this.titre,
        description: this.description
      }

      console.log('calendrier : ', calendrier)

      api.saveCalendar(calendrier).then(response => {
        console.log('response : ', response)
        response.data === 'save' ? this.success() : this.error()
      })
    },
    getPeriods () {
      if (!this.calendrier.cours.length) return []
      const periodes = []

      const cours = sortBy(this.calendrier.cours, 'debut')
      let currentDate = this.calendrier.periodOfTraining.start
      let currentCours = cours.shift()

      while (currentCours) {
        if (!isSameDay(currentDate, currentCours.debut)) {
          periodes.push({
            debut: currentDate,
            fin: getPreviousWorkingDay(currentCours.debut)
          })
        }
        periodes.push(currentCours)
        currentDate = getNextWorkingDay(currentCours.fin)
        currentCours = cours.shift()
      }
      if (!isSameDay(currentDate, this.calendrier.periodOfTraining.end)) {
        periodes.push({
          debut: currentDate,
          fin: this.calendrier.periodOfTraining.end
        })
      }

      return periodes
    }
  }
}
</script>

<style>
.calendarGenerate {
  width: 95%;
}

.el-calendarGenerate > .el-col {
  margin-left: 1em !important;
}

.choose {
  margin: 1em !important;
  margin-bottom: 2em !important;
}
</style>
