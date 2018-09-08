<template>
  <div id="infoFormation">
    <br/>
    <div>
      <el-button icon="el-icon-arrow-left" @click="goBack()"></el-button>
      {{ this.$route.params.id }}
    </div>
    <br/>

    <PrerequisModule :codeFormation="this.$route.params.id" :setModulePrerequisPlanning="setModulePrerequisPlanning"/>

    <!-- <table class="table">
      <thead>
        <th>N°</th>
        <th>Noms des modules</th>
        <th>Modules requis</th>
        <th>Modules optionnels</th>
      </thead>
      <tr v-for="item in tableFormationComplet"
          v-bind:key="item.idMod">
        <th> {{ item.idMod }} </th>
        <th> {{ item.lib }} </th>

        <th>
          <select v-on:change="ajoutModuleRequis(item.idMod, $event)"
                  multiple
                  class="selectpicker" >
            <option v-for="mrp in item.modulesRequisPossibles"
                    v-if="checkSelected(item.idMod, mrp.idM, 'req')"
                    selected
                    v-bind:key="mrp.idM" >
              {{ mrp.idM }}
            </option>
            <option v-for="mrp in item.modulesRequisPossibles"
                    v-if="checkSelected(item.idMod, mrp.idM, 'req') === false"
                    v-bind:key="mrp.idM" >
              {{ mrp.idM }}
            </option>
          </select>
        </th>
        <th>
          <select v-on:change="ajoutModuleOpt(item.idMod, $event)"
                multiple
                class="selectpicker">
            <option v-for="mop in item.modulesOptPossibles"
                    v-if="checkSelected(item.idMod, mop.idM, 'opt')"
                    selected
                    v-bind:key="mop.idM">
              {{ mop.idM }}
            </option>
            <option v-for="mop in item.modulesOptPossibles"
                    v-if="checkSelected(item.idMod, mop.idM, 'opt') === false"
                    v-bind:key="mop.idM">
              {{ mop.idM }}
            </option>
          </select>
        </th>
      </tr>
    </table> -->
    <el-alert v-if="success"
      :title=tittleAlert
      :type=typeAlert
      show-icon>
    </el-alert>
    <br/>

    <el-row>
      <el-button v-on:click="save" type="primary" :loading="load">Sauvegarder</el-button>
    </el-row>
    <br/>
  </div>
</template>

<script>
import axios from 'axios'
import PrerequisModule from '../PrerequisModule'

export default {
  name: 'InfoFormation',
  components: {
    PrerequisModule
  },
  data () {
    return {
      modulePrerequisPlanning: null,
      allPrerequis: [],
      tablePrerequis: [],
      prerequisForFormation: [],
      tableFormation: [],
      tableFormationComplet: [],
      load: false,
      success: false,
      typeAlert: null,
      tittleAlert: null

    }
  },

  created () {
    // this.getPrerequis(this.getPrerequisForFormation)
    // this.getModulesForFormation(this.remplisageTableFormation)
  },

  methods: {
    setModulePrerequisPlanning (modulePrerequisPlanning) {
      this.modulePrerequisPlanning = modulePrerequisPlanning
    },
    getModulePrerequisPlanning () {
      return this.modulePrerequisPlanning
    },
    // Méthode qui met tous les prérequis dans le tableau tablePrerequis
    async getPrerequis (callback) {
      // console.log("dedbut getPrerequis")
      // on vide le tableau avant appel
      var l = this.tablePrerequis.length
      this.tablePrerequis.splice(0, l)
      await axios
        .get('http://localhost:9000/modulesPrerequis')
        .then(response => {
          this.tablePrerequis = response.data
        })
      await callback(this.tablePrerequis)
      // console.log("fin getPrerequis")
    },

    // Méthode qui ne garde que les prérequis pour la formation sélectionnées
    async getPrerequisForFormation (tableauPrerequis) {
      // console.log("dedbut getPrerequis")
      // On vide le tableau avant appel
      var l = this.prerequisForFormation.length
      this.prerequisForFormation.splice(0, l)
      for (let i = 0; i < tableauPrerequis.length; i++) {
        if (tableauPrerequis[i].codeFormation === this.$route.params.id) {
          var obj = {}
          obj['idPrerequis'] = tableauPrerequis[i].idModulePrerequis
          obj['idModule'] = tableauPrerequis[i].idModule

          var tabReq = []
          for (let j = 0; j < tableauPrerequis[i].idModuleObligatoire.length; j++) {
            tabReq.push(tableauPrerequis[i].idModuleObligatoire[j])
          }
          obj['idModuleObligatoire'] = tabReq

          var tabOpt = []
          for (let j = 0; j < tableauPrerequis[i].idModuleOpionnel.length; j++) {
            tabOpt.push(tableauPrerequis[i].idModuleOpionnel[j])
          }
          obj['idModuleOpionnel'] = tabOpt
          this.prerequisForFormation.push(obj)
        }
      }

      // console.log("fin getPrerequis")
    },

    // Méthode qui récupère tous les modules de la formation
    async getModulesForFormation (callback) {
      // console.log("debut getModulesForFormation")
      await axios
        .get('http://localhost:9000/formations/' + this.$route.params.id + '/modules')
        .then(response => {
          this.tableFormation = response.data
          this.tableFormation.forEach((name) => {
            this.tableFormationComplet.push({
              lib: name.libelle,
              idMod: name.idModule,
              modulesRequisPossibles: [],
              modulesRequisSelect: [],
              modulesOptPossibles: [],
              modulesOptSelect: []
            })
          })
        })
      await callback(this.tableFormation)
      // console.log("fin getModulesForFormation")
    },

    // Méthode qui ajoute les modules possiblement requis par module
    // Ajoute également les modules sélectionnés lors des prérequis précédent (en base)
    async remplisageTableFormation (tableauFormation) {
      // console.log("debut remplisageTableFormation")
      for (let i = 0; i < tableauFormation.length; i++) {
        this.tableFormationComplet.forEach((name, index) => {
          if (i !== index) {
            this.tableFormationComplet[i].modulesRequisPossibles.push({idM: name.idMod})
            this.tableFormationComplet[i].modulesOptPossibles.push({idM: name.idMod})
          }
        })
        for (let j = 0; j < this.prerequisForFormation.length; j++) {
          if (this.tableFormationComplet[i].idMod === this.prerequisForFormation[j].idModule) {
            for (let k = 0; k < this.prerequisForFormation[j].idModuleObligatoire.length; k++) {
              this.tableFormationComplet[i].modulesRequisSelect.push({idM: parseInt(this.prerequisForFormation[j].idModuleObligatoire[k])})
            }

            for (let k = 0; k < this.prerequisForFormation[j].idModuleOpionnel.length; k++) {
              this.tableFormationComplet[i].modulesOptSelect.push({idM: parseInt(this.prerequisForFormation[j].idModuleOpionnel[k])})
            }
          }
        }
      }
      // console.log("fin remplisageTableFormation")
    },

    // Méthode qui ajoute ou enlève les modules requis selectionnés du tableau tableFormationComplet
    ajoutModuleRequis: function (idModuleAModif, event) {
      // console.log("On va modifier dans le module : ", idModuleAModif)
      for (let i = 0; i < event.target.selectedOptions.length; i++) {
        // console.log("event : ", event.target.selectedOptions[i].label)
      }

      for (let i = 0; i < this.tableFormationComplet.length; i++) {
        if (this.tableFormationComplet[i].idMod === idModuleAModif) {
          // On vide modulesRequisSelect
          var sizeToRemove = this.tableFormationComplet[i].modulesRequisSelect.length
          this.tableFormationComplet[i].modulesRequisSelect.splice(0, sizeToRemove)

          // On ajoute les nouvelles options
          for (let j = 0; j < event.target.selectedOptions.length; j++) {
            this.tableFormationComplet[i].modulesRequisSelect.push({idM: parseInt(event.target.selectedOptions[j].label)})
          }
        }
      }
    },

    // Méthode qui ajoute ou enlève les modules optionnels selectionnés du tableau tableFormationComplet
    ajoutModuleOpt: function (idModuleAModif, event) {
      // console.log("On va modifier dans le module : ", idModuleAModif)
      for (let i = 0; i < event.target.selectedOptions.length; i++) {
        // console.log("event : ", event.target.selectedOptions[i].label)
      }

      for (let i = 0; i < this.tableFormationComplet.length; i++) {
        if (this.tableFormationComplet[i].idMod === idModuleAModif) {
          // On vide modulesOptSelect
          var sizeToRemove = this.tableFormationComplet[i].modulesOptSelect.length
          this.tableFormationComplet[i].modulesOptSelect.splice(0, sizeToRemove)

          // On ajoute les nouvelles options
          for (let j = 0; j < event.target.selectedOptions.length; j++) {
            this.tableFormationComplet[i].modulesOptSelect.push({idM: parseInt(event.target.selectedOptions[j].label)})
          }
        }
      }
    },

    save () {
      // On recharge les données concernant les prerequis
      this.getPrerequis(this.getPrerequisForFormation)
      this.load = true
      this.success = false
      this.typeAlert = 'info'
      this.tittleAlert = 'Aucune mise à jour'
      var egaliteRequis = true
      var egaliteOpt = true

      for (let i = 0; i < this.tableFormationComplet.length; i++) {
        var update = false
        var tabReq = []
        var idPrerequis = -1
        for (let j = 0; j < this.tableFormationComplet[i].modulesRequisSelect.length; j++) {
          tabReq.push(parseInt(this.tableFormationComplet[i].modulesRequisSelect[j].idM))
        }

        var tabOpt = []
        for (let j = 0; j < this.tableFormationComplet[i].modulesOptSelect.length; j++) {
          tabOpt.push(parseInt(this.tableFormationComplet[i].modulesOptSelect[j].idM))
        }

        var exist = false
        for (let j = 0; j < this.prerequisForFormation.length; j++) {
          // console.log("1-1 DEBUT | on doit vérifier si un prérequis existe pour la formation1 :", this.tableFormationComplet[i].idMod)
          if (this.prerequisForFormation[j].idModule === this.tableFormationComplet[i].idMod) {
            exist = true
            idPrerequis = j
            // console.log("1-2 idPrerequis = ", idPrerequis)
          }
        }
        if (exist) {
          // console.log("2 un prerequis existe pour cette formation : ", this.tableFormationComplet[i].idMod)
          if ((this.tableFormationComplet[i].modulesRequisSelect.length > 0) || (this.tableFormationComplet[i].modulesOptSelect.length > 0)) {
            // console.log("3 on doit tester si il y a eu des modif")
            for (let j = 0; j < this.prerequisForFormation.length; j++) {
              if (this.prerequisForFormation[j].idModule === this.tableFormationComplet[i].idMod) {
                var idModulePrereq = this.prerequisForFormation[j].idPrerequis
                // console.log("4-1 prerequis :", idModulePrereq)

                if (this.tableFormationComplet[i].modulesRequisSelect.length === 0) {
                  if (this.prerequisForFormation[j].idModuleObligatoire.length !== 0) {
                    egaliteRequis = false
                    console.log('4-2 egaliteRequis = false')
                  }
                } else {
                  for (let k = 0; k < this.tableFormationComplet[i].modulesRequisSelect.length; k++) {
                    egaliteRequis = false
                    // console.log("5 egaliteRequis = false")
                    for (let l = 0; l < this.prerequisForFormation[j].idModuleObligatoire.length; l++) {
                      // console.log("6 valeur prerequise de base :", this.prerequisForFormation[j].idModuleObligatoire[l])
                      // console.log("7 valeur prerequis dans le tab :", this.tableFormationComplet[i].modulesRequisSelect[k].idM)
                      if (this.tableFormationComplet[i].modulesRequisSelect[k].idM === this.prerequisForFormation[j].idModuleObligatoire[l]) {
                        egaliteRequis = true
                        // console.log("8-1 egaliteRequis BREAK")
                        break
                      }
                    }
                  }
                }
                if (this.tableFormationComplet[i].modulesOptSelect.length === 0) {
                  if (this.prerequisForFormation[j].idModuleOpionnel.length !== 0) {
                    egaliteOpt = false
                    console.log('8-2 egaliteOpt = false')
                  }
                } else {
                  for (let k = 0; k < this.tableFormationComplet[i].modulesOptSelect.length; k++) {
                    egaliteOpt = false
                    // console.log("9 egaliteOpt = false")
                    for (let l = 0; l < this.prerequisForFormation[j].idModuleOpionnel.length; l++) {
                      // console.log("10 valeur prerequise de base :", this.prerequisForFormation[j].idModuleOpionnel[l])
                      // console.log("11 valeur prerequis dans le tab :", this.tableFormationComplet[i].modulesOptSelect[k].idM)
                      if (this.tableFormationComplet[i].modulesOptSelect[k].idM === this.prerequisForFormation[j].idModuleOpionnel[l]) {
                        egaliteOpt = true
                        // console.log("12 egaliteOpt BREAK")
                        break
                      }
                    }
                  }
                }
              }
            }

            if (!egaliteRequis || !egaliteOpt) {
              console.log('13 on doit update')
              update = true
            } else {
              // console.log("14 on n'update pas")

            }
          } else {
            // console.log("15-1 On test si le prérequis est vide")
            if (this.prerequisForFormation[idPrerequis].idModuleObligatoire.length === 0 && this.prerequisForFormation[idPrerequis].idModuleOpionnel.length === 0) {
              // console.log("15-2 Prerequis vide, pas de maj")
            } else {
              console.log('15-3 Prerequis no vide, update')
              update = true
            }
          }
        } else {
          // console.log("16 PAS de prerequis existe pour cette formation : ", this.tableFormationComplet[i].idMod)
          // console.log("17 on doit vérifier s'il faut en créer un")
          if ((this.tableFormationComplet[i].modulesRequisSelect.length > 0) || (this.tableFormationComplet[i].modulesOptSelect.length > 0)) {
            // console.log("18 on doit créer le prerequis :", this.tableFormationComplet[i].idMod)

            var uuid = Math.floor((1 + Math.random()) * 0x1000000000000)
              .toString(16)
              .substring(1)

            let textJson = '{\n' +
                '    "idModulePrerequis" : "' + uuid + '",\n' +
                '    "idModule" : ' + this.tableFormationComplet[i].idMod + ',\n' +
                '    "idModuleObligatoire" : [' + tabReq.toString() + '],\n' +
                '    "idModuleOpionnel" : [' + tabOpt.toString() + '],\n' +
                '    "titre" : "' + this.tableFormationComplet[i].lib + '",\n' +
                '    "description" : "' + this.tableFormationComplet[i].lib + '",\n' +
                '    "codeFormation" : "' + this.$route.params.id + '"\n' +
                '}'
            let objJson = JSON.parse(textJson)

            axios.post('http://localhost:9000/modulesPrerequis', objJson)
              .then(function (response) {
                console.log('saved successfully: ', response)
              })
            this.typeAlert = 'success'
            this.tittleAlert = 'Succès lors de la création des prérequis'
            // console.log("19 create :", this.tableFormationComplet[i].idMod)
          } else {
            // console.log("20 on ne fait rien")
          }
        }

        if (update === true) {
          // console.log("21 update : ", this.tableFormationComplet[i].idMod)
          // console.log("22 avec prereq : ", idModulePrereq)

          let textJson = '{\n' +
              '    "idModulePrerequis" : "' + idModulePrereq + '",\n' +
              '    "idModule" : ' + this.tableFormationComplet[i].idMod + ',\n' +
              '    "idModuleObligatoire" : [' + tabReq.toString() + '],\n' +
              '    "idModuleOpionnel" : [' + tabOpt.toString() + '],\n' +
              '    "titre" : "' + this.tableFormationComplet[i].lib + '",\n' +
              '    "description" : "' + this.tableFormationComplet[i].lib + '",\n' +
              '    "codeFormation" : "' + this.$route.params.id + '"\n' +
              '}'
          let objJson = JSON.parse(textJson)

          axios.post('http://localhost:9000/modulesPrerequisUpdate', objJson)
            .then(function (response) {
              console.log('saved successfully: ', response)
            })
          console.log('maj : ', idModulePrereq)
          this.typeAlert = 'success'
          this.tittleAlert = 'Succès lors de la mise à jour des prérequis'
        }
      }
      this.load = false
      this.success = true
    },

    checkSelected (idModuleContrainte, idModuleACocher, type) {
      for (let i = 0; i < this.prerequisForFormation.length; i++) {
        if (this.prerequisForFormation[i].idModule === idModuleContrainte) {
          if (type === 'req') {
            // console.log("type REQ")
            for (let j = 0; j < this.prerequisForFormation[i].idModuleObligatoire.length; j++) {
              // console.log("aaaa: ", this.prerequisForFormation[i].idModuleObligatoire[j])
              if (this.prerequisForFormation[i].idModuleObligatoire[j] === idModuleACocher) {
                // console.log("@@@@@@@@@@@@@@@@on doit select : ", idModuleACocher)

                this.varStop++
                return true
              }
            }
          } else {
            // console.log("type OPT")
            for (let j = 0; j < this.prerequisForFormation[i].idModuleOpionnel.length; j++) {
              if (this.prerequisForFormation[i].idModuleOpionnel[j] === idModuleACocher) {
                // console.log("################on doit select : ", idModuleACocher)

                this.varStop++
                return true
              }
            }
          }
        }
      }
      return false
    },

    goBack () {
      this.$router.push('/listeFormation/')
    }

  }
}

</script>

<style>
#infoFormation {
  width: 100%;
}
</style>
