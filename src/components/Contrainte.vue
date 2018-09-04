<template>
  <div>
    <el-form ref="form" :model="form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="Lieux de formation">
            <el-select v-model="selectedLieux" multiple placeholder="Lieux">
              <el-option
                v-for="lieu in form.lieux"
                :key="lieu.codeLieu"
                :label="lieu.libelle"
                :value="lieu.codeLieu">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Durée maximum de formation">
            <el-row>
              <el-col :span="4">
                <el-input v-model="form.maxFormationNombre" type="number"></el-input>
              </el-col>
              <el-col :span="8">
                <el-select v-model="selectedMaxFormationTemps" placeholder="définir une durée">
                  <el-option
                    v-for="lieu in form.maxFormation"
                    :key="lieu"
                    :label="lieu"
                    :value="lieu">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Volume d'heure maximum de formation">
            <el-row>
              <el-col :span="4">
                <el-input v-model="form.volumeMaxFormationNombre" type="number"></el-input>
              </el-col>
              <el-col :span="2">
                heures réparties sur
              </el-col>
              <el-col :span="4">
                <el-input v-model="form.volumeMaxFormationSurNombre" type="number"></el-input>
              </el-col>
              <el-col :span="4">
                <el-select v-model="selectedVolumeMaxFormationTemps" placeholder="définir une durée">
                  <el-option
                    v-for="lieu in form.maxFormation"
                    :key="lieu"
                    :label="lieu"
                    :value="lieu">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Durée maximum des sessions de formation">
            <el-row>
              <el-col :span="4">
                <el-input v-model="form.volumeMaxFormationNombre" type="number"></el-input>
              </el-col>
              <el-col :span="4">
                semaines
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Ne doit pas avoir le même calendrier que">
            <el-select v-model="selectedStagiaires" multiple placeholder="stagiaires">
              <el-option
                v-for="stagiaire in form.stagiaires"
                :key="stagiaire.codeStagiaire"
                :label="stagiaire.nom"
                :value="stagiaire.nom">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" v-on:click="submitForm('form')">Créer</el-button>
    </span>

    <el-form :model="form" ref="form" >
      <el-form-item label="Titre" prop="titre">
        <el-input v-model="form.titre" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="form.description" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from '../api'
export default {
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        lieux: [],
        maxFormationNombre: '',
        maxFormation: ['semaines', 'mois', 'année'],
        volumeMaxFormationNombre: '',
        volumeMaxFormationSurNombre: '',
        stagiaires: []
      },
      selectedLieux: [],
      selectedStagiaires: [],
      selectedMaxFormationTemps: '',
      selectedVolumeMaxFormationTemps: ''
    }
  },

  created () {
    this.getLieu()
    this.getStagaire()
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.createConstraint()
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
    getLieu () {
      api.getLieux().then(response => {
        this.form.lieux = response.data
      })
    },
    getStagaire () {
      api.getStagiaires().then(response => {
        this.form.stagiaires = response.data
      })
    },
    createConstraint () {
      let constraint
      api.saveConstraint(constraint)
      console.log(`selectedLieux : ${this.selectedLieux}`)
    }
  }
}
</script>
