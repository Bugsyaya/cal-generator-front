<template>
  <div>
    <div>
      <!-- {{ getConstraintById().titre }} -->
      <div class="simple-page">
        <el-col :span="14">
          <el-col :span="24">
            <el-form ref="form" :model="form" label-position="right" label-width="300px">
              <Container @drop="onDrop">
                <Draggable v-for="contrainte in contraintes" :key="contrainte.type">
                  <el-col :span="24">
                    <el-form-item label="Lieux de formation" v-if="contrainte.type === 'place'">
                      <el-select v-model="contrainte.value" placeholder="Lieux">
                        <el-col :span="24">
                          <el-option
                            v-for="lieu in form.lieux"
                            :key="lieu.codeLieu"
                            :label="lieu.libelle"
                            :value="lieu.codeLieu">
                          </el-option>
                        </el-col>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="Durée maximum de formation" v-if="contrainte.type === 'maxDurationOfTraining'">
                      <el-col :span="4">
                        <el-input v-model="contrainte.value" type="number" min="0"/>
                      </el-col>
                      <el-col :span="8">
                        <p>semaines</p>
                      </el-col>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="Volume d'heure maximum de formation" v-if="contrainte.type === 'annualNumberOfHour'">
                      <el-col :span="4">
                        <el-input v-model="contrainte.value" type="number" min="0"/>
                      </el-col>
                      <el-col :span="2">
                        <p>heures</p>
                      </el-col>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="Durée des sessions" v-if="contrainte.type === 'trainingFrequency'">
                      <el-col :span="22">
                        <el-col :span="8">
                          <p>- Maximum en formation : </p>
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="contrainte.value.maxWeekInTraining" type="number" min="0"/>
                        </el-col>
                        <el-col :span="7">
                          <p> semaines </p>
                        </el-col>
                      </el-col>
                      <el-col :span="22">
                        <el-col :span="8">
                          <p>- Minimum en entreprise : </p>
                        </el-col>
                        <el-col :span="4">
                          <el-input v-model="contrainte.value.minWeekInCompany" type="number" min="0"/>
                        </el-col>
                        <el-col :span="7">
                          <p> semaines </p>
                        </el-col>
                      </el-col>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="Période en entreprise obligatoire" v-if="contrainte.type === 'listPeriodeOfTrainingExclusion'">
                      <el-row>
                        <el-col :span="20">
                          <el-row v-for="value in contrainte.value" :key="value.id">
                            <el-col :span="15">
                              <el-date-picker
                              center
                                aria-required="true"
                                v-model="value.value"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                start-placeholder="Début de la période"
                                end-placeholder="Fin de la période"
                                firstDayOfWeek="2">
                              </el-date-picker>
                            </el-col>
                            <el-col :span="8" :offset="1">
                              <el-button icon="el-icon-close" circle type="danger" @click="removeChildValue(contrainte, value.id)"/>
                            </el-col>
                          </el-row>
                          <el-col :span="2" :offset="6">
                            <el-button icon="el-icon-plus" circle @click="addChildValue(contrainte)"/>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="Période en cours obligatoire" v-if="contrainte.type === 'listPeriodeOfTrainingInclusion'">
                      <el-row>
                        <el-col :span="20">
                          <el-row v-for="value in contrainte.value" :key="value.id">
                            <el-col :span="15">
                              <el-date-picker
                              center
                                aria-required="true"
                                v-model="value.value"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                start-placeholder="Début de la période"
                                end-placeholder="Fin de la période"
                                firstDayOfWeek="2">
                              </el-date-picker>
                            </el-col>
                            <el-col :span="8" :offset="1">
                              <el-button icon="el-icon-close" circle type="danger" @click="removeChildValue(contrainte, value.id)"/>
                            </el-col>
                          </el-row>
                          <el-col :span="2" :offset="6">
                            <el-button icon="el-icon-plus" circle @click="addChildValue(contrainte)"/>
                          </el-col>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </Draggable>
              </Container>
            </el-form>
          </el-col>
          <el-col :span="2" :offset="11">
            <el-button type="primary" @click="dialogFormVisible = true">Sauvegarder</el-button>
          </el-col>
        </el-col>
      <el-col :span="10">
        <el-collapse id="collapse">
          <el-collapse-item v-for="constraint in this.allConstraints" v-bind:key="constraint.idConstraint" :title="constraint.titre" :name="constraint.idConstraint">
            <el-col :span="20">
              {{ constraint.description }}
            </el-col>
            <el-col :span="20">
              <div v-if="constraint.place">
                <p>
                  Lieu de formation : {{ getLieuById(constraint.place.value).libelle }}
                </p>
              </div>
            </el-col>
            <el-col :span="20">
              <div v-if="constraint.annualNumberOfHour">
                <p>
                  Volume d'heure maximum de formation : {{ constraint.annualNumberOfHour.value }} heures
                </p>
              </div>
            </el-col>
            <el-col :span="20">
              <div v-if="constraint.maxDurationOfTraining">
                <p>
                  Durée maximum de formation : {{ constraint.maxDurationOfTraining.value  }} semaine
                </p>
              </div>
            </el-col>
            <el-col :span="20">
              <div v-if="constraint.trainingFrequency">
                <p>
                  Durée maximum des sessions de formation : {{ constraint.trainingFrequency.value.maxWeekInTraining  }} semaines
                </p>
                <p>
                  Durée minumum des sessions en entreprise : {{ constraint.trainingFrequency.value.minWeekInCompany  }} semaines
                </p>
              </div>
            </el-col>
            <el-col :span="20">
              <div v-if="constraint.listPeriodeOfTrainingInclusion">
                <p>Période en entreprise obligatoire :</p>
                <p v-for="periode in constraint.listPeriodeOfTrainingInclusion" :key="periode.start">
                  - du {{ periode.value.start }} au {{ periode.value.end }}
                </p>
              </div>
            </el-col>
            <el-col :span="20">
              <div v-if="constraint.listPeriodeOfTrainingExclusion">
                <p>Période en formation obligatoire :</p>
                <p v-for="periode in constraint.listPeriodeOfTrainingExclusion" :key="periode.start">
                  - du {{ periode.value.start }} au {{ periode.value.end }}
                </p>
              </div>
            </el-col>
            <el-col :span="4" :offset="10">
              <el-button type="primary" round class="choixContraint" @click="completConstraint(constraint.idConstraint)">Copier</el-button>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      </div>
    </div>

    <el-dialog title="Sauvegarde de la contrainte" :visible.sync="dialogFormVisible">
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
import { Container, Draggable } from 'vue-smooth-dnd'
import keyBy from 'lodash/keyBy'
import map from 'lodash/map'
import omit from 'lodash/omit'
import mapValues from 'lodash/mapValues'
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import find from 'lodash/find'

export default {
  name: 'contrainte',
  props: {
    setIdConstraint: Function,
    idConstraint: String
  },
  data () {
    return {
      dialogFormVisible: false,
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
      },
      contraintes: [
        {
          type: 'place',
          value: '',
          id: ''
        },
        {
          id: '',
          type: 'annualNumberOfHour',
          value: 0
        },
        {
          type: 'maxDurationOfTraining',
          value: 0,
          id: ''
        },
        {
          id: '',
          type: 'trainingFrequency',
          value: {
            maxWeekInTraining: 0,
            minWeekInCompany: 0
          }
        },
        {
          type: 'listPeriodeOfTrainingExclusion',
          value: [],
          id: ''
        },
        {
          type: 'listPeriodeOfTrainingInclusion',
          value: [],
          id: ''
        }
      ],
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
      selectedVolumeMaxFormationTemps: '',
      allConstraints: [],
      savedConstraints: []
    }
  },

  created () {
    this.getLieu()
      .then(() => this.getStagaire())
      .then(() => this.getConstraints())
      .then(() => this.completConstraint(this.idConstraint))
  },
  components: { Container, Draggable },
  watch: {
    idConstraint: (newVal) => {
    }
  },
  methods: {
    completConstraint (iConstraint) {
      this.setIdConstraint(iConstraint)
      this.contraintes = [
        {
          type: 'place',
          value: ''
        },
        {
          type: 'annualNumberOfHour',
          value: 0
        },
        {
          type: 'maxDurationOfTraining',
          value: 0
        },
        {
          type: 'trainingFrequency',
          value: {
            maxWeekInTraining: 0,
            minWeekInCompany: 0
          }
        },
        {
          type: 'listPeriodeOfTrainingExclusion',
          value: []
        },
        {
          type: 'listPeriodeOfTrainingInclusion',
          value: []
        }]
      if (iConstraint) {
        const constraint = this.allConstraints.find(constraint => constraint.idConstraint === iConstraint)
        mapValues(omit(constraint, ['idConstraint', 'titre', 'description']), (contrainte, type) => {
          const line = find(this.contraintes, { type })

          if (isArray(contrainte)) {
            const uuidv1 = require('uuid/v1')
            line.priority = isEmpty(contrainte) ? -1 : contrainte[0].priority
            line.value = contrainte.map((c, id) => ({ id, value: [c.value.start, c.value.end] }))
            line.id = uuidv1()
          } else {
            const uuidv1 = require('uuid/v1')
            line.priority = contrainte.priority
            line.value = contrainte.value
            line.id = uuidv1()
          }

          this.contraintes.sort((c1, c2) => {
            if (c1.priority === c2.priority) return 0
            if (c1.priority === undefined) return 1
            if (c2.priority === undefined) return -1
            if (c1.priority < c2.priority) return 1
            return -1
          })
        })
      }
    },
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
      this.getConstraints().then(() =>
        this.$notify({
          title: 'Sauvegarder',
          message: 'La contrainte a correctement été enregistré',
          type: 'success'
        })
      )
    },
    error () {
      this.$notify({
        title: 'Erreur',
        message: 'Une erreur s\'est produite',
        type: 'error'
      })
    },
    getConstraints () {
      return api.getConstraints().then(response => {
        this.allConstraints = response.data
      })
    },
    getConstraintById () {
      return this.allConstraints.find(constraint => constraint.idContraint === this.idConstraint || {'titre': ''})
    },
    getLieu () {
      return api.getLieux().then(response => {
        this.form.lieux = response.data
      })
    },
    getLieuById (lieuId) {
      const lieu = this.form.lieux.find(lieu => lieu.codeLieu === lieuId)
      return lieu || { libelle: 'Lieu inconnu' }
    },
    getStagaire () {
      return api.getStagiaires().then(response => {
        this.form.stagiaires = response.data
      })
    },
    createConstraint () {
      this.dialogFormVisible = false
      api.saveConstraint(this.getContrainteObject()).then(response => {
        this.setIdConstraint(response.data.idConstraint)
        response.data.idConstraint ? this.success() : this.error()
      })
    },
    onDrop ({removedIndex, addedIndex, payload}) {
      const result = [...this.contraintes]
      let itemToAdd = payload
      if (removedIndex !== null) itemToAdd = result.splice(removedIndex, 1)[0]
      if (addedIndex !== null) result.splice(addedIndex, 0, itemToAdd)
      this.contraintes = result
    },
    getContrainteObject () {
      const parseIntValue = contrainte => {
        const intValue = parseInt(contrainte.value)
        return {...contrainte, value: intValue || contrainte.value}
      }
      const contraintes = this.contraintes
        .filter(contrainte => contrainte.value !== '' && contrainte.value !== 0)
        .map((contrainte, i) => (
          {...contrainte, priority: contrainte.value ? 10 - i : -1}
        ))

      const {listPeriodeOfTrainingExclusion, listPeriodeOfTrainingInclusion, trainingFrequency, ...contrainteObject} = keyBy(contraintes, 'type')

      const uuidv1 = require('uuid/v1')
      const uuidv2 = require('uuid/v1')
      const uuidv3 = require('uuid/v1')
      const result = {
        ...contrainteObject,
        trainingFrequency:
          trainingFrequency.value.maxWeekInTraining && trainingFrequency.value.minWeekInCompany
            ? {
              ...trainingFrequency,
              value: {
                maxWeekInTraining: parseInt(trainingFrequency.value.maxWeekInTraining),
                minWeekInCompany: parseInt(trainingFrequency.value.minWeekInCompany)
              },
              id: uuidv1()
            }
            : undefined,
        listPeriodeOfTrainingExclusion:
          listPeriodeOfTrainingExclusion.value.length
            ? listPeriodeOfTrainingExclusion.value.map(({value: [start, end]}) => ({
              ...listPeriodeOfTrainingExclusion,
              value: { start, end },
              id: uuidv2()
            }))
            : undefined,
        listPeriodeOfTrainingInclusion:
          listPeriodeOfTrainingInclusion.value.length
            ? listPeriodeOfTrainingInclusion.value.map(({value: [start, end]}) => ({
              ...listPeriodeOfTrainingInclusion,
              value: { start, end },
              id: uuidv3()
            }))
            : undefined
      }

      const omitType = contrainte => omit(contrainte, 'type')

      return {...mapValues(
        omitBy(result, contrainte => isNil(contrainte) || (isArray(contrainte.value) && isEmpty(contrainte.value))),
        contrainte => {
          if (isArray(contrainte)) return contrainte.map(omitType).map(parseIntValue)
          return parseIntValue(omitType(contrainte))
        }
      ),
      titre: this.form.titre,
      description: this.form.description
      }
    },
    addChildValue (item) {
      const periode = { value: [], id: item.value.length }
      item.value.push(periode)
    },
    removeChildValue (item, valueId) {
      item.value = item.value.filter(({ id }) => id !== valueId)
    },
    async contr () {
      const { data: contraintes } = await api.getConstraints()
      this.savedConstraints = contraintes.map(contrainte => ({
        id: contrainte.idConstraint,
        label: `${contrainte.titre} - ${contrainte.description}`,
        children: map(omit(contrainte, ['titre', 'description', 'idConstraint']), (value, key) => ({
          id: value.id,
          label: key
        }))
      }))
    }
  }
}
</script>

<style>
.el-form-item__label {
  margin-top: 0em;
}

.el-form-item__content {
  margin-left: 300px !important;
}

.el-select {
  width: 90%;
}

p {
  margin-left: 1em;
}

.choixContraint {
  margin: 1em;
}

#collapse {
  max-height: 75vh;
  overflow: auto;
}
</style>
