<template>
  <el-row  id="planningLayout">
    <HeaderPlanning :number="number" :title="titre" :description="description"/>
    <el-tabs tab-position="top" class="positionInformation">
      <el-tab-pane label="Planning">
        <Planning :setTitle="setTitle"
                  :setIdConstraint="setIdConstraint"
                  :idConstraint="idConstraint"
                  :setDescription="setDescription"
                  :getTitle="getTitle"
                  :setIsDisabled="setIsDisabled"
                  :disabled="isDisabled"
                  :setStepNumber="setNumber"
                  :getStepNumber="getNumber"/>
      </el-tab-pane>
      <el-tab-pane label="Contraintes">
        <Contraintes :setIdConstraint="setIdConstraint"
                     :idConstraint="idConstraint"/>
      </el-tab-pane>
      <el-tab-pane label="Modules">
        <!-- <ContraintesModule/> -->
      </el-tab-pane>
      <el-tab-pane label="Historique" :disabled="isDisabled"/>
    </el-tabs>
  </el-row>
</template>

<script>
import * as api from '../api'
import Planning from './Planning'
import Contraintes from './Contrainte'
import HeaderPlanning from './HeaderPlanning'
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'planningLayout',
  components: {Planning, Contraintes, HeaderPlanning},
  data () {
    return {
      isDisabled: true,
      idConstraint: '',
      number: 0,
      calendriers: [],
      lieux: [],
      needModules: [],
      calendrier: Object,
      titre: '',
      description: ''
    }
  },
  created () {
    this.getCalendrier().then(() =>
      this.createTitle()
    )
  },
  methods: {
    setIsDisabled (isDisabled) {
      this.isDisabled = isDisabled
    },
    getIsDisabled () {
      return this.isDisabled
    },
    setIdConstraint (idConstraint) {
      this.idConstraint = idConstraint
    },
    getIdConstraint () {
      return this.idConstraint
    },
    setNumber (int) {
      this.number = int
    },
    getNumber () {
      return this.number
    },
    setTitle (ti) {
      this.titre = ti
    },
    getTitle () {
      return this.titre
    },
    setDescription (desc) {
      this.description = desc
    },
    getDescription () {
      return this.description
    },
    getCalendrier () {
      return api.getCalendriers().then(response => {
        this.calendriers = response.date
      })
    },
    createTitle () {
      if (this.$route.params.idCalendar) {
        api.getCalendriersById(this.$route.params.idCalendar).then(response => {
          this.titre = `${response.data.titre}`
          this.description = `${response.data.description}`
        })
      } else {
        this.titre = `Planning pour ${this.$route.params.id}`
      }
    }
  }
}
</script>

<style>
#planningLayout {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  flex: 1;
}

#calendriers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

form {
  margin: 2em;
}

/* table {
  margin: 1em;
  border: 1px #ddd solid;
  box-shadow: #eee 5px 5px 5px;
  border-spacing: 0;
  border-collapse: collapse;
}

tr:hover {
  background: #eee;
}

td,
th {
  padding: 0.5em 1em;
}

th {
  border-bottom: #bbb solid 1px;
  background-color: #ddd;
}

td:nth-child(1),
th:nth-child(1) {
  text-align: left;
}

tr.total {
  background-color: #ddd;
} */

.message {
  font-size: 20px;
}

label {
  margin: 1em;
}

.positionInformation{
  position: relative;
  top: 2em;
}

#titre{
  width: 100%;
}
</style>
