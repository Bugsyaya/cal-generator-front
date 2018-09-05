<template>
  <div>
    <div>
      <el-button icon="el-icon-arrow-left" @click="goBack()"></el-button>
      {{ this.$route.params.id }}
    </div>
    <table>
      <tr>
        <th>N°</th>
        <th>Noms des modules</th>
        <th>Modules requis</th>
        <th>Modules optionnels</th>
      </tr>
      <tr v-for="item in tableFormationComplet" >
        <th> {{ item.idMod }}__  </th>
        <th> {{ item.lib }} </th>

        <th><select v-on:change="ajoutModuleRequis(item.idMod, $event)" multiple class="selectpicker">
          <option v-for="mrp in item.modulesRequisPossibles" v-if="checkSelected(item.idMod, mrp.idM, 'req')" selected> {{ mrp.idM }}</option>
          <option v-for="mrp in item.modulesRequisPossibles" v-if="checkSelected(item.idMod, mrp.idM, 'req') === false"> {{ mrp.idM }}</option>

        </select></th>
        <th><select v-on:change="ajoutModuleOpt(item.idMod, $event)" multiple class="selectpicker">
          <option v-for="mop in item.modulesOptPossibles" v-if="checkSelected(item.idMod, mop.idM, 'opt')" selected> {{ mop.idM }}</option>
          <option v-for="mop in item.modulesOptPossibles" v-if="checkSelected(item.idMod, mop.idM, 'opt') === false"> {{ mop.idM }}</option>
        </select></th>
      </tr>
    </table>

    <el-row>
      <el-button v-on:click="save" type="success" plain>Sauvegarder</el-button>
      <el-button type="danger" plain>Annuler</el-button>
    </el-row>



      <p> <b>tablePrerequis:</b> {{ this.tablePrerequis }}</p>
      <p> <b>prerequisForFormation:</b> {{ this.prerequisForFormation }}</p>
      <p></p>
      <p> <b>tableFormation:</b> {{ this.tableFormation }}</p>
      <p> <b>tableFormationComplet:</b> {{ this.tableFormationComplet }}</p>


  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "InfoFormation",


    data() {
      return {
        tablePrerequis: [],
        prerequisForFormation: [],
        tableFormation: [],
        tableFormationComplet: [],

      }
    },

    created () {
      this.getPrerequis(this.getPrerequisForFormation)
      this.getModulesForFormation(this.remplisageTableFormation)

    },

    methods: {

      // Méthode qui met tous les prérequis dans le tableau tablePrerequis
      async getPrerequis (callback) {
        // console.log("dedbut getPrerequis")
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
        for (var i = 0; i < tableauPrerequis.length; i++) {
          if (tableauPrerequis[i].codeFormation === this.$route.params.id) {
            var obj = {}
            obj['idModule']=tableauPrerequis[i].idModule

            var tabReq = []
            for (var j = 0; j < tableauPrerequis[i].idModuleObligatoire.length; j++) {
              tabReq.push(tableauPrerequis[i].idModuleObligatoire[j])
            }
            obj['idModuleObligatoire']=tabReq

            var tabOpt = []
            for (var j = 0; j < tableauPrerequis[i].idModuleOpionnel.length; j++) {
              tabOpt.push(tableauPrerequis[i].idModuleOpionnel[j])
            }
            obj['idModuleOpionnel']=tabOpt
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
              });
            });
          })
        await callback(this.tableFormation)
        // console.log("fin getModulesForFormation")
      },

      // Méthode qui ajoute les modules possiblement requis par module
      // Ajoute également les modules sélectionnés lors des prérequis précédent (en base)
      async remplisageTableFormation (tableauFormation) {
        // console.log("debut remplisageTableFormation")
        for (var i = 0; i < tableauFormation.length; i++) {
          this.tableFormationComplet.forEach((name, index) => {
            if (i !== index) {
              this.tableFormationComplet[i].modulesRequisPossibles.push({idM:name.idMod})
              this.tableFormationComplet[i].modulesOptPossibles.push({idM:name.idMod})
            }
          });
          for (var j = 0; j < this.prerequisForFormation.length; j++) {
            if (this.tableFormationComplet[i].idMod === this.prerequisForFormation[j].idModule) {

              for (var k = 0; k < this.prerequisForFormation[j].idModuleObligatoire.length; k++) {
                this.tableFormationComplet[i].modulesRequisSelect.push({idM:parseInt(this.prerequisForFormation[j].idModuleObligatoire[k])})
              }

              for (var k = 0; k < this.prerequisForFormation[j].idModuleOpionnel.length; k++) {
                this.tableFormationComplet[i].modulesOptSelect.push({idM:parseInt(this.prerequisForFormation[j].idModuleOpionnel[k])})
              }

            }
          }
        }
        // console.log("fin remplisageTableFormation")
      },

      // Méthode qui ajoute ou enlève les modules requis selectionnés du tableau tableFormationComplet
      ajoutModuleRequis: function(idModuleAModif, event) {
        // console.log("On va modifier dans le module : ", idModuleAModif)
        for (var i = 0; i < event.target.selectedOptions.length; i++) {
          // console.log("event : ", event.target.selectedOptions[i].label)
        }

        for (var i = 0; i < this.tableFormationComplet.length; i++) {
           if (this.tableFormationComplet[i].idMod === idModuleAModif) {
             // On vide modulesRequisSelect
             var sizeToRemove = this.tableFormationComplet[i].modulesRequisSelect.length
             this.tableFormationComplet[i].modulesRequisSelect.splice(0, sizeToRemove)

             // On ajoute les nouvelles options
             for (var j = 0; j < event.target.selectedOptions.length; j++) {
               this.tableFormationComplet[i].modulesRequisSelect.push({idM:parseInt(event.target.selectedOptions[j].label)})
             }

           }
        }
      },

      // Méthode qui ajoute ou enlève les modules optionnels selectionnés du tableau tableFormationComplet
      ajoutModuleOpt: function(idModuleAModif, event) {
        // console.log("On va modifier dans le module : ", idModuleAModif)
        for (var i = 0; i < event.target.selectedOptions.length; i++) {
          // console.log("event : ", event.target.selectedOptions[i].label)
        }

        for (var i = 0; i < this.tableFormationComplet.length; i++) {
          if (this.tableFormationComplet[i].idMod === idModuleAModif) {
            // On vide modulesOptSelect
            var sizeToRemove = this.tableFormationComplet[i].modulesOptSelect.length
            this.tableFormationComplet[i].modulesOptSelect.splice(0, sizeToRemove)

            // On ajoute les nouvelles options
            for (var j = 0; j < event.target.selectedOptions.length; j++) {
              this.tableFormationComplet[i].modulesOptSelect.push({idM:parseInt(event.target.selectedOptions[j].label)})
            }

          }
        }
      },

      save () {
        //console.log('Début Save')
        var sizeTableDate = this.tableFormationComplet.length

        for (var i = 0; i < sizeTableDate; i++) {
          if ((this.tableFormationComplet[i].modulesRequisSelect.length > 0) || (this.tableFormationComplet[i].modulesOptSelect.length > 0)) {

            var tabReq = []
            for (var j = 0; j < this.tableFormationComplet[i].modulesRequisSelect.length; j++) {
              tabReq.push(parseInt(this.tableFormationComplet[i].modulesRequisSelect[j].idM))
            }

            var tabOpt = new Array()
            for (var j = 0; j < this.tableFormationComplet[i].modulesOptSelect.length; j++) {
              tabOpt.push(parseInt(this.tableFormationComplet[i].modulesOptSelect[j].idM))
            }

            var uuid = Math.floor((1 + Math.random()) * 0x1000000000000)
              .toString(16)
              .substring(1);

            // console.log("uuid : ", uuid)

            var textJson = '{\n' +
              '    "idModulePrerequis" : "' + uuid + '",\n' +
              '    "idModule" : '+ this.tableFormationComplet[i].idMod +',\n' +
              '    "idModuleObligatoire" : [' + tabReq.toString() + '],\n' +
              '    "idModuleOpionnel" : [' + tabOpt.toString() + '],\n' +
              '    "titre" : "'+ this.tableFormationComplet[i].lib +'",\n' +
              '    "description" : "'+ this.tableFormationComplet[i].lib +'",\n' +
              '    "codeFormation" : "'+ this.$route.params.id +'"\n' +
              '}'

            var objJson = JSON.parse(textJson)
            // console.log("Affichage de l'obj: ", objJson)

            axios.post('http://localhost:9000/modulesPrerequis', objJson)
              .then(function(response){
                console.log('saved successfully: ', response)
              });
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

      goBack() {
        this.$router.push('/listeFormation/');
      },




    }
  }

</script>
