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
      <tr v-for="item in tableData2" >
        <th> {{item.ind+1 }}</th>
        <th> {{ item.lib }} </th>
        <th><select multiple class="selectpicker">
          <option v-for="se in item.modulePossible"> {{ se.id }}</option>
        </select></th>
      </tr>
    </table>





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
          tableData2: [],

        }
      },

      created () {
        this.getModules(this.loadTableData2)

      },

      methods: {
        async getModules (callback) {
          /*var obj = {}*/
          await axios
            .get('http://localhost:9000/formations/' + this.$route.params.id + '/modules')
            .then(response => {
              this.formation = response.data
              this.formation.forEach((name, index) => {
                this.tableData2.push({
                  ind: index,
                  lib: name.libelle,
                  modulePossible: [],
                  moduleSelection: []
                });
              });
            })
            await callback(this.formation)
        },

        async loadTableData2 (formCall) {
          console.log("testCall: ", formCall.length)
          var obj = {}
          for (var i = 0; i < formCall.length; i++) {
            this.tableData2.forEach((name, index) => {
              if (i !== index) {
                /*console.log('test1: ', i)*/
               /* console.log('test2: ', index)*/
                obj['id']=index
                this.tableData2[i].modulePossible.push({id:index+1})
              }
            });
          }
        },

        goBack() {
          this.$router.push('/listeFormation/');
        },

        ajoutModule: function(posDansListe, event) {
          var tailleSelection = event.target.selectedOptions.length
          var tailleTableData = this.tableData[posDansListe].moduleSelection.length
          var listeSelection = event.target.selectedOptions
          var listeTableData = this.tableData[posDansListe].moduleSelection
          var obj = {}
          var onAjoute = 1
          var isEgale = 0
          //console.log("tailleSelection: ", tailleSelection)
          //console.log("tailleTableData: ", tailleTableData)

          if (tailleSelection === 0) {
            this.addFromPossible(posDansListe)
            listeTableData.splice(0, tailleTableData)
            return 0
          }

          if (tailleTableData === 0) {
            //console.log("tableau vide, on ajoute")
            obj['id'] = listeSelection[0].label
            //console.log("Ajout debut: ", obj.id)
            listeTableData.push(obj)
            this.removeFromPossible(posDansListe, obj.id);
            return 0

          } else {
            //console.log("tableau non vide")
            for (var i = 0; i < tailleSelection; i++) {
              //console.log("loop i: ", i)
              obj['id'] = listeSelection[i].label
              for (var j = 0; j < tailleTableData; j++) {
                //console.log("loop j: ", j)
                if (onAjoute === 1) {
                  //console.log("listeSelection[i]: ", listeSelection[i].label)
                  //console.log("listeTableData[j]: ", listeTableData[j].id)
                  if (listeSelection[i].label === listeTableData[j].id) {
                    //console.log("egalite")
                    onAjoute = 0
                  }
                }
              }
              if (onAjoute !== 0) {
                //console.log("Ajout final: ", obj.id)
                listeTableData.push(obj)
                this.removeFromPossible(posDansListe, obj.id);
                return 0
              }
              //console.log("On remet l'ajout à 1")
              onAjoute = 1

            }
          }
          if (tailleSelection > 0) {
            for (var i = 0; i < tailleTableData; i++) {
              //console.log("loop i: ", i)
              isEgale = 0
              for (var j = 0; j < tailleSelection; j++) {
                //console.log("loop j: ", j)
                //console.log("listeTableData[i].id: ", listeTableData[i].id)
                //console.log("listeSelection[j].label: ", listeSelection[j].label)
                if (isEgale === 0) {
                  if (listeTableData[i].id === listeSelection[j].label) {
                    //console.log("C'est égale")
                    isEgale = 1
                  }
                }
              }
              if (isEgale === 0) {
                console.log("on doit supprimer: ", listeTableData[i].id)
                console.log("on ajoute :", posDansListe+1)
                console.log('à la liste :', listeTableData[i].id)
                obj['id'] = posDansListe+1
                this.tableData[listeTableData[i].id-1].modulePossible.push(obj)
                listeTableData.splice(i, 1)

                return 0
              }
            }
          }
        },

        addFromPossible: function(posDansListe) {
          var isPresent = 0
          var obj = {}
          for (var i = 0; this.tableData.length; i++) {
            for (var j = 0; j < this.tableData[i].modulePossible.length; j++) {
              if (isPresent === 0) {
                if (this.tableData[i].modulePossible[j].id === posDansListe+1) {
                  isPresent = 1
                } else {
                  isPresent = 0
                }
              }
            }
            if (isPresent === 0) {
              obj['id']=posDansListe+1
              this.tableData[i].modulePossible.push(obj)
              return 0
            }
            isPresent = 0
          }

        },


        removeFromPossible: function(placeDuModuleASupp, idListeAmodif) {
          var moduleASupp = placeDuModuleASupp +1
          var listeAModif = idListeAmodif -1
          var tailleListePossible = this.tableData[listeAModif].modulePossible.length
          var listePossible = this.tableData[listeAModif].modulePossible
          for (var i = 0; i < tailleListePossible; i++) {
            if (listePossible[i].id === moduleASupp) {
              // console.log("on supprime à l'indice: ", i)
              this.tableData[listeAModif].modulePossible.splice(i, 1)
              return 0
            }
          }

        },
      },
    }
</script>

