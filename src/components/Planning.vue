<template>
  <el-row id="planning">
    <el-col :span="24">
      <form action="">
          <el-col :span="6" class="block">
            <el-date-picker
            aria-required="true"
              v-model="periodeFormation"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="Début de la formation"
              end-placeholder="Fin de la formation"
              firstDayOfWeek="2">
            </el-date-picker>
          </el-col>
      </form>

        <router-view
          :idConstraint="idConstraint"
          :idModulePrerequisPlanning="idModulePrerequisPlanning"
          :setIdModulePrerequisPlanning="setIdModulePrerequisPlanning"
          :setIdConstraint="setIdConstraint"
          :codeFormation="planning.codeFormation"
          :needModules="needModules"
          :lieux="lieux"
          :periodeFormation="periodeFormation"
          :success="() => this.setStepNumber(1)"
          :setStepNumber="setStepNumber"
          :getStepNumber="getStepNumber"
          :setTitle="setTitle"
          :getTitle="getTitle"
          :setDescription="setDescription"
        ></router-view>
    </el-col>
  </el-row>
</template>

<script>
import Calendar from './Calendar'
import HeaderPlanning from './HeaderPlanning'
import * as api from '../api'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'planning',
  props: {
    setStepNumber: Function,
    getStepNumber: Function,
    setTitle: Function,
    getTitle: Function,
    setDescription: Function,
    idConstraint: String,
    setIdConstraint: Function,
    idModulePrerequisPlanning: String,
    setIdModulePrerequisPlanning: {type: Function, default: () => {}}
  },
  data () {
    return {
      showDate: new Date(),
      periodeFormation: [],
      dateFormation: [],
      loaded: false,
      loading: false,
      selectedLieux: [],
      planning: {
        codeFormation: this.$route.params.id
      },
      calendriers: [],
      lieux: [],
      needModules: [],
      calendrier: Object
    }
  },
  components: {
    Calendar,
    HeaderPlanning
  },
  created () {
    this.getLieu()
    this.getModulesFormation()
  },
  methods: {
    savePlanning () {
    },
    showPlanning () {
      this.calendriers = []
      this.loading = true
      const [start, end] = this.periodeFormation
      api.generateCalendar({
        ...this.planning,
        periodOfTraining: { start, end },
        idConstraint: this.idConstraint,
        numberOfCalendarToFound: 5
      })
        .then(response => {
          this.setStepNumber(1)
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
    },
    getLieu () {
      api.getLieux().then(response => {
        this.lieux = response.data
      })
    },
    getModulesFormation () {
      api.getModulesByCodeFormation(this.$route.params.id).then(response => {
        this.needModules = response.data
      })
    }
  }
}
</script>

<style>
.v-navigation-drawer{
  visibility: hidden;
}

.ds-app-calendar-toolbar{
  visibility: hidden;
}

.ds-expand{
  padding: 0px 0px 0px 0px !important;
}

#containerModule {
  display: flex;
  order: 1;
  flex-direction: row;
  flex-wrap: wrap;
}

#planning {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#listeModules {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: flex;
  order: 1;
}

#tabCal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

#calendrier {
  width:100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

#containerCalendriers {
  display: flex;
}

form {
  margin: 2em;
}

.message {
  font-size: 20px;
}

label {
  margin: 1em;
}
.el-table__row .cell {
  word-break: normal;
  text-align: justify;
}
</style>
