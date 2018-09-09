<template>
  <div id="moreInfoCal">
    <div v-if=titleAndDescNeeded>
      <el-col :span="2" :offset="11">
        <el-button class="choose" round align="center" @click="dialogFormVisible = true">{{buttonName}}</el-button>
      </el-col>
      <el-dialog :title="titrePopUp" :visible.sync="dialogFormVisible">
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
    <div v-else>
      <el-col :span="2" :offset="11">
        <el-button class="choose" round align="center" v-on:click="choose()">Choisir</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
import * as api from '../api'
import omit from 'lodash/omit'
import trim from 'lodash/trim'

export default {
  name: 'moreInfoCal',
  props: {
    buttonName: {type: String, default: 'Choisir'},
    calendrier: { type: Object },
    needRedirection: Boolean,
    titleAndDescNeeded: true,
    setTitle: Function,
    titrePopUp: String,
    messageSuccess: String,
    messageError: String,
    saveFunction: Function,
    setTitre: Function,
    setDescription: Function
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
          if (this.needRedirection) {
            this.choosePlanning().then(() =>
              this.$router.push(`/planning/${this.calendrier.codeFormation}/details/${this.calendrier.idCalendrier}`)
            )
          } else {
            this.setTitre(this.form.titre)
            this.setDescription(this.form.description)
            this.dialogFormVisible = false
            this.saveFunction().then(response => {
              response.data ? this.success() : this.error()
            })
          }
        } else {
          return false
        }
      })
    },
    success () {
      this.$notify({
        title: 'Sauvegarder',
        message: this.messageSuccess,
        type: 'success'
      })
    },
    error () {
      this.$notify({
        title: 'Erreur',
        message: this.messageError,
        type: 'error'
      })
    },
    choosePlanning () {
      this.dialogFormVisible = false
      const calendrier = {
        ...omit(this.calendrier, ['id', 'nbTotalHeures']),
        titre: this.form.titre,
        description: this.form.description,
        codeFormation: trim(`${this.$route.params.id}`)
      }
      return api.saveCalendar(calendrier).then(response => {
        response.data === 'save' ? this.success() : this.error()
      })
    },
    choose () {
      this.$router.push(`/planning/${this.calendrier.codeFormation}/details/${this.calendrier.idCalendrier}`)
    }
  }
}
</script>

<style>

</style>
