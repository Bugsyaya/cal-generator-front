<template>
  <div>
    <div>
      <el-button icon="el-icon-arrow-left" @click="goBack()"></el-button>
      {{ this.$route.params.id }}
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="Modules" name="first">
        <el-table
        :data="formation"
        style="width: 100%"
        height="auto"
        >
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="libelle"
            label="Liste des modules"
            width="600"
            fixed>
          </el-table-column>
          <el-table-column
            label="Module(s) Pré-requis"
            width="180">
            <template slot-scope="value">
              <el-select v-model="value5" multiple placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>

          </el-table-column>
          <el-table-column
            label="Module(s) Optionnel(s)"
            width="180">


          </el-table-column>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Contraintes" name="second">
        TODO CONTRAINTES
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
    import axios from 'axios'
    import ListeModulesPourFormation from '../FormationD/ListeModulesPourFormation'

    export default {
        name: "InfoFormation",
        components: {ListeModulesPourFormation},

      data() {
        return {
          activeName: 'first',
          formation: [],
          options: [{
            value: 'S1',
            label: '1'
          }, {
            value: 'S2',
            label: '2'
          }, {
            value: 'S3',
            label: '3'
          }, {
            value: 'S4',
            label: '4'
          }, {
            value: 'S5',
            label: '5'
          }],
          value5: [],
        }
      },

      created () {
        this.getModules()
      },

      methods: {
        getModules () {
          axios
            .get('http://localhost:9000/formations/' + this.$route.params.id + '/modules')
            .then(response => {
              this.formation = response.data
            })
        },

        goBack() {
          this.$router.push('/listeFormation/');
        },
      }
    }
</script>

