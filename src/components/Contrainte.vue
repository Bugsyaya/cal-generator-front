<template>
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

      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Create</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
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
    onSubmit () {
      console.log('submit!')
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
    }
  }
}
</script>
