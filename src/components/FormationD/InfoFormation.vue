<template>
  <div>
    <div>
      <el-button icon="el-icon-arrow-left" @click="goBack()"></el-button>
      {{ this.$route.params.id }}
    </div>

<!--    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Modules" name="first">
          Liste des modules
        </el-tab-pane>
        <el-tab-pane label="Contraintes" name="second">
          TODO CONTRAINTES
        </el-tab-pane>

      </el-tabs>
      <div>

      </div>
    </div>-->


    <table>
      <tr>
        <th>N°</th>
        <th>Noms des modules</th>
        <th>Modules requis</th>
        <th>Modules optionnels</th>
      </tr>
      <tr v-for="item in tableData" >
        <th> {{ item.ind+1 }}</th>
        <th> {{ item.lib }} </th>
        <th><select v-on:change="ajoutModule(item.ind, $event, 'req')" multiple class="selectpicker">
          <option v-for="mrp in item.modulesRequisPossibles" v-if="checkSelected(item.idMod, mrp.idM, 'req')" selected> {{ mrp.id }}</option>
          <option v-for="mrp in item.modulesRequisPossibles" v-if="checkSelected(item.idMod, mrp.idM, 'req') === false"> {{ mrp.id }}</option>
         <!-- <option v-for="mrp in item.modulesRequisPossibles"> {{ mrp.idM }} </option>-->
        </select></th>
        <th><select v-on:change="ajoutModule(item.ind, $event, 'opt')" multiple class="selectpicker">
          <option v-for="mop in item.modulesOptPossibles" v-if="checkSelected(item.idMod, mop.idM, 'opt')" selected> {{ mop.id }}</option>
          <option v-for="mop in item.modulesOptPossibles" v-if="checkSelected(item.idMod, mop.idM, 'opt') === false"> {{ mop.id }}</option>
        </select></th>
      </tr>
    </table>

    <el-row>
      <el-button v-on:click="save" type="success" plain>Sauvegarder</el-button>
      <el-button v-on:click="testLog('toCancel')" type="danger" plain>Annuler</el-button>
    </el-row>

    <p> Premier: {{ tableData[0] }} </p>
    <p> Troisième: {{ tableData[2] }} </p>
    <p> Prerequis {{ prerequis }} </p>
    <p> RrerequisForFormation {{ prerequisForFormation }} </p>





  </div>
</template>

<script>
    import axios from 'axios'
    import ListeModulesPourFormation from '../FormationD/ListeModulesPourFormation'

    /*import jQuery from 'jquery'
    let $ = jQuery*/


    export default {
        name: "InfoFormation",
        components: {ListeModulesPourFormation},

      data() {
        return {
          formation: [],
          tableData: [],
          prerequis: [],
          prerequisForFormation: []

        }
      },

      created () {
        this.getPrerequis(this.getPrerequisForFormation)
        this.getModules(this.loadTableData2)
      },

      methods: {
        save () {
          //console.log('Début Save')
          var sizeTableDate = this.tableData.length

          for (var i = 0; i < sizeTableDate; i++) {
            if ((this.tableData[i].modulesRequisSelect.length > 0) || (this.tableData[i].modulesOptSelect.length > 0)) {
              // console.log("moduleRequisSelect ou modulesOptSelect non vide")
              var tabReq = []
              for (var j = 0; j < this.tableData[i].modulesRequisSelect.length; j++) {
                tabReq.push(parseInt(this.tableData[i].modulesRequisSelect[j].id))
              }

              var tabOpt = new Array()
              for (var j = 0; j < this.tableData[i].modulesOptSelect.length; j++) {
                tabOpt.push(parseInt(this.tableData[i].modulesOptSelect[j].id))
              }


              // console.log('testTabReq :', tabReq.toString())
              var uuid = Math.floor((1 + Math.random()) * 0x1000000000000)
                .toString(16)
                .substring(1);

              // console.log("uuid : ", uuid)

              var textJson = '{\n' +
                '    "idModulePrerequis" : "' + uuid + '",\n' +
                '    "idModule" : '+ this.tableData[i].idMod +',\n' +
                '    "idModuleObligatoire" : [' + tabReq.toString() + '],\n' +
                '    "idModuleOpionnel" : [' + tabOpt.toString() + '],\n' +
                '    "titre" : "'+ this.tableData[i].lib +'",\n' +
                '    "description" : "'+ this.tableData[i].lib +'",\n' +
                '    "codeFormation" : "'+ this.$route.params.id +'"\n' +
                '}'

              var objJson = JSON.parse(textJson)
              // console.log("Affichage de l'obj: ", objJson)

              axios.post('http://localhost:9000/modulesPrerequis', objJson)
                .then(function(response){
                  // console.log('saved successfully: ', response)
                });
            }
          }
        },

        async getModules (callback) {
          /*var obj = {}*/
          await axios
            .get('http://localhost:9000/formations/' + this.$route.params.id + '/modules')
            .then(response => {
              this.formation = response.data
              this.formation.forEach((name, index) => {
                this.tableData.push({
                  ind: index,
                  lib: name.libelle,
                  idMod: name.idModule,
                  modulesRequisPossibles: [],
                  modulesRequisSelect: [],
                  modulesOptPossibles: [],
                  modulesOptSelect: []
                });
              });
            })
            await callback(this.formation)
        },

        async loadTableData2 (formCall) {
          // console.log("testCall: ", formCall.length)
          var obj = {}
          for (var i = 0; i < formCall.length; i++) {
            // console.log("test2")
            this.tableData.forEach((name, index) => {
              if (i !== index) {
                /*console.log('test1: ', i)*/
               /* console.log('test2: ', index)*/
                //obj['id']=index+1
                //obj['idM']=name.idMod
                // console.log("On ajout idMod dans le optPossible : ", name.idMod)
                this.tableData[i].modulesRequisPossibles.push({id:index+1, idM:name.idMod})
                this.tableData[i].modulesOptPossibles.push({id:index+1, idM:name.idMod})
              }
            });
            // for (var j = 0; j < this.prerequis.length; j++) {
            //   // console.log("test1")
            //   if (this.tableData[i].idMod === this.prerequis[j].idModule) {
            //     console.log("test4 : ", this.prerequis)
            //     var objRequis = {}
            //     var objOpt = {}
            //
            //     for (var k = 0; k < this.prerequis[j].length; k++) {
            //       console.log("test3")
            //       objRequis["id"]=this.prerequis[j].idModuleObligatoire[k]
            //       objOpt["id"]=this.prerequis[j].idModuleOpionnel[k]
            //       console.log("on ajoute le module prérequis dans le select : ", this.prerequis[j].idModuleObligatoire[k])
            //       console.log("on ajoute le module opt dans le select : ", this.prerequis[j].idModuleOpionnel[k])
            //       this.tableData[i].modulesRequisSelect.push(objRequis)
            //       this.tableData[i].modulesOptSelect.push(objOpt)
            //     }
            //
            //   }
            // }
          }
          await this.putSelected()
        },

        async putSelected() {
          console.log("etat du table prerequis : ", this.prerequis)
        },

        async getPrerequis (callback) {
          // console.log("dedbut getPrerequis")
          await axios
            .get('http://localhost:9000/modulesPrerequis')
            .then(response => {
              this.prerequis = response.data
            })
          // console.log("fin getPrerequis")
          await callback(this.prerequis)
        },

        async getPrerequisForFormation (requisCall) {
          // console.log("debut getPrerequisForFormation :", requisCall)
          for (var i = 0; i < requisCall.length; i++) {
            if (requisCall[i].codeFormation === this.$route.params.id) {
              // console.log("on a des prerequis pour la formation : ", requisCall[i].codeFormation)
              var obj = {}
              obj['idModule']=requisCall[i].idModule


              var tabReq = []
              for (var j = 0; j < requisCall[i].idModuleObligatoire.length; j++) {
                tabReq.push(requisCall[i].idModuleObligatoire[j])
                // console.log("OOOOOOOOOOOOOOO :", requisCall[i].idModuleObligatoire[j])
              }
              // console.log("EEEEEEEEEEEEEEE :", tabReq)
              obj['idModuleObligatoire']=tabReq


              var tabOpt = []
              for (var j = 0; j < requisCall[i].idModuleOpionnel.length; j++) {
                tabOpt.push(requisCall[i].idModuleOpionnel[j])
                // console.log("AAAAAAAAAA :", requisCall[i].idModuleOpionnel[j])
              }
              // console.log("IIIIIIIIIII :", tabOpt)

              obj['idModuleOpionnel']=tabOpt
              // console.log("obj a push :", obj)

              this.prerequisForFormation.push(obj)

              // console.log("array prerequisForFormation: ", this.prerequisForFormation[0].idModuleOpionnel[0])
            }
          }
        },

        checkSelected(idModuleContrainte, idModuleACocher, type ) {
          // console.log("idModule ou l'on veut ajouter une contrainte : ", idModuleContrainte)
          // console.log("idModule a cocher : ", idModuleACocher)
          // console.log("type de liste : ", type)


            for (var i = 0; i < this.prerequisForFormation.length; i++) {
              if (this.prerequisForFormation[i].idModule === idModuleContrainte) {
                if (type === "req") {
                  // console.log("type REQ")
                  for (var j = 0; j < this.prerequisForFormation[i].idModuleObligatoire.length; j++) {
                    // console.log("aaaa: ", this.prerequisForFormation[i].idModuleObligatoire[j])
                    if (this.prerequisForFormation[i].idModuleObligatoire[j] === idModuleACocher) {
                      // console.log("@@@@@@@@@@@@@@@@on doit select : ", idModuleACocher)

                      this.varStop++
                      return true
                    }
                  }
                } else {
                  // console.log("type OPT")
                  for (var j = 0; j < this.prerequisForFormation[i].idModuleOpionnel.length; j++) {
                    if (this.prerequisForFormation[i].idModuleOpionnel[j] === idModuleACocher) {
                      // console.log("################on doit select : ", idModuleACocher)

                      this.varStop++
                      return true
                    }
                  }

                }
              }
            }
          // console.log("&&&&&&&&&&&&&&&On ne selectionne rien")

          return false
        },


        testLog(action) {
          console.log(action)
        },



        goBack() {
          this.$router.push('/listeFormation/');
        },

         ajoutModule: function(posDansListe, event, tab) {
           // console.log('param1 : ', posDansListe)
           // console.log('param1 : ', event)


           if(tab === 'req') {
             // console.log("on doit ajouter dans requis: ", tab)
             var tailleTableData = this.tableData[posDansListe].modulesRequisSelect.length
             var listeTableData = this.tableData[posDansListe].modulesRequisSelect

           } else {
             // console.log("on doit ajouter dans opt: ", tab)
             var tailleTableData = this.tableData[posDansListe].modulesOptSelect.length
             var listeTableData = this.tableData[posDansListe].modulesOptSelect
           }

          var tailleSelection = event.target.selectedOptions.length

          var listeSelection = event.target.selectedOptions

          var obj = {}
          var onAjoute = 1
          var isEgale = 0
          // console.log("tailleSelection: ", tailleSelection)
          // console.log("tailleTableData: ", tailleTableData)

          if (tailleSelection === 0) {
            this.addFromPossible(posDansListe)
            listeTableData.splice(0, tailleTableData)
            return 0
          }

          if (tailleTableData === 0) {
            // console.log("tableau vide, on ajoute")
            obj['id'] = listeSelection[0].label
            // console.log("Ajout debut: ", obj.id)
            listeTableData.push(obj)
            //this.removeFromPossible(posDansListe, obj.id);
            return 0

          } else {
            // console.log("tableau non vide")
            for (var i = 0; i < tailleSelection; i++) {
              // console.log("loop i: ", i)
              obj['id'] = listeSelection[i].label
              for (var j = 0; j < tailleTableData; j++) {
                // console.log("loop j: ", j)
                if (onAjoute === 1) {
                  // console.log("listeSelection[i]: ", listeSelection[i].label)
                  // console.log("listeTableData[j]: ", listeTableData[j].id)
                  if (listeSelection[i].label === listeTableData[j].id) {
                    // console.log("egalite")
                    onAjoute = 0
                  }
                }
              }
              if (onAjoute !== 0) {
                // console.log("Ajout final: ", obj.id)
                listeTableData.push(obj)
                //this.removeFromPossible(posDansListe, obj.id);
                return 0
              }
              // console.log("On remet l'ajout à 1")
              onAjoute = 1

            }
          }
          if (tailleSelection > 0) {
            for (var i = 0; i < tailleTableData; i++) {
              // console.log("loop i: ", i)
              isEgale = 0
              for (var j = 0; j < tailleSelection; j++) {
                // console.log("loop j: ", j)
                // console.log("listeTableData[i].id: ", listeTableData[i].id)
                // console.log("listeSelection[j].label: ", listeSelection[j].label)
                if (isEgale === 0) {
                  if (listeTableData[i].id === listeSelection[j].label) {
                    // console.log("C'est égale")
                    isEgale = 1
                  }
                }
              }
              if (isEgale === 0) {
                // console.log("on doit supprimer: ", listeTableData[i].id)
                // console.log("on ajoute :", posDansListe+1)
                // console.log('à la liste :', listeTableData[i].id)
                obj['id'] = posDansListe+1
                if(tab === 'req') {
                  this.tableData[listeTableData[i].id-1].modulesRequisPossibles.push(obj)
                } else {
                  this.tableData[listeTableData[i].id-1].modulesOptPossibles.push(obj)
                }

                listeTableData.splice(i, 1)

                return 0
              }
            }
          }
        },

        addFromPossible: function(posDansListe, tab) {
          var isPresent = 0
          var obj = {}
          // console.log("taille du tableau : ", this.tableData.length)


          for (var i = 0; i < this.tableData.length; i++) {
            if(tab === 'req') {
              var size = this.tableData[i].modulesRequisPossibles.length
            } else {
              var size = this.tableData[i].modulesOptPossibles.length
            }
            for (var j = 0; j < size; j++) {
              if (isPresent === 0) {
                if(tab === 'req') {
                  var posId = this.tableData[i].modulesRequisPossibles[j].id
                } else {
                  var posId =this.tableData[i].modulesOptPossibles[j].id
                }
                if (posId === posDansListe+1) {
                  isPresent = 1
                } else {
                  isPresent = 0
                }
              }
            }
            if (isPresent === 0) {
              obj['id']=posDansListe+1
              if(tab === 'req') {
                this.tableData[i].modulesRequisPossibles.push(obj)
              } else {
                this.tableData[i].modulesOptPossibles.push(obj)
              }
              return 0
            }
            isPresent = 0
          }

        },


        // removeFromPossible: function(placeDuModuleASupp, idListeAmodif) {
        //   var moduleASupp = placeDuModuleASupp +1
        //   var listeAModif = idListeAmodif -1
        //   var tailleListePossible = this.tableData[listeAModif].modulesRequisPossibles.length
        //   var listePossible = this.tableData[listeAModif].modulesRequisPossibles
        //   for (var i = 0; i < tailleListePossible; i++) {
        //     if (listePossible[i].id === moduleASupp) {
        //       // console.log("on supprime à l'indice: ", i)
        //       this.tableData[listeAModif].modulesRequisPossibles.splice(i, 1)
        //       return 0
        //     }
        //   }
        //
        // },
      },
    }
</script>

