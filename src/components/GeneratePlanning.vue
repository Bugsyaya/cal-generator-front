<template>
  <div>
    <el-col :span="12">
      <el-col :span="22">
        <div class="block">
            <span class="demonstration">Nombre de calendriers à générer</span>
            <el-slider
              v-model="numberOfCalendarToFound"
              :step="1"
              :max="10"
              :min="1"
              show-stops>
            </el-slider>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" round plain v-on:click="showPlanning()" :loading="loading">
          Générer
        </el-button>
      </el-col>
    </el-col>

    <el-col :span="24">
      <div  class="message" v-if="!calendriers.length && loaded && !loading">
        Aucune solution possible pour les paramètres donnés.
        <Calendar class="calendarGenerate" :calendrier="defaultCalendar()" :lieux="lieux" :modules="needModules" />
        <MoreInfoCal
          id="moreInfoCal"
          class="calendarGenerate"
          buttonName="Sauvegarder"
          messageSuccess="Le calendrier a bien été sauvegardé"
          messageError="Une erreur s'est produite"
          :setTitre="setTitle"
          :setDescription="setDescription"
          titrePopUp="Sauvegarde du calendrier"
          :needRedirection=true
          titleAndDescNeeded=true
          :calendrier="defaultCalendar()"
        />
      </div>
      <el-row id="containerCalendriers" v-if="!loading && loaded">
        <el-col :span="24">
          <div v-for="calendar in calendriers" :key="calendar.idCalendrier">
              <el-col :span="12">
                <Calendar :calendrier="calendar" class="calendarGenerate" :cours="calendar.cours" :lieux="lieux" :modules="needModules" />
                <MoreInfoCal id="moreInfoCal"
                            class="calendarGenerate"
                            buttonName="Sauvegarder"
                            messageSuccess="Le calendrier a bien été sauvegardé"
                            messageError="Une erreur s'est produite"
                            :setTitre="setTitle"
                            :setDescription="setDescription"
                            titrePopUp="Sauvegarde du calendrier"
                            :needRedirection=true
                            titleAndDescNeeded=true
                            :calendrier="calendar" />
              </el-col>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
import Calendar from './Calendar'
import MoreInfoCal from './MoreInfoCal'
import * as api from '../api'
import uuidv1 from 'uuid/v1'

export default {
  name: 'generatePlanning',
  props: {
    lieux: Array,
    needModules: Array,
    periodeFormation: Array,
    codeFormation: String,
    success: Function,
    setTitle: Function,
    getTitle: Function,
    setDescription: Function,
    idConstraint: String,
    isDisabled: Boolean,
    setIsDisabled: Function,
    setIdModulePrerequisPlanning: Function,
    idModulePrerequisPlanning: String
  },
  data: () => ({
    calendriers: [],
    loaded: false,
    loading: false,
    numberOfCalendarToFound: 5
  }),
  methods: {
    defaultCalendar () {
      return {
        idCalendrier: uuidv1(),
        codeFormation: this.codeFormation,
        periodOfTraining: { start: this.periodeFormation[0], end: this.periodeFormation[1] },
        cours: [],
        status: 'created'
      }
    },
    showPlanning () {
      this.calendriers = []
      this.loading = true
      const [start, end] = this.periodeFormation
      api.generateCalendar({
        codeFormation: this.codeFormation,
        periodOfTraining: { start, end },
        idConstraint: this.idConstraint,
        idModulePrerequisPlanning: this.idModulePrerequisPlanning,
        numberOfCalendarToFound: this.numberOfCalendarToFound
      })
        .then(response => {
          this.success()
          this.calendriers = response.data
            .filter(calendrier => calendrier.cours.length)
            .map((calendrier, i) => ({
              ...calendrier,
              id: i,
              nbTotalHeures: calendrier.cours.reduce(
                (acc, cours) => acc + cours.dureeReelleEnHeures,
                0
              )
            }))
        })
        .catch(err => console.error(err))
        .then(() => {
          this.loaded = true
          this.loading = false
        })
    }
  },

  components: {
    Calendar,
    MoreInfoCal
  }
}
</script>

<style>
.calendarGenerate {
  width: 95%;
}

.choose {
  margin: 1em !important;
  margin-bottom: 2em !important;
}
</style>
