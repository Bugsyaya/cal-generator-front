<template>
  <div>
    <div>
      <el-button icon="el-icon-arrow-left" @click="goBack()"></el-button>
      {{ module.libelle }}
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Informations" name="first">
        TODO INFO
        <!--<el-table>
          <el-table-column>
            <p>Nom du module :</p>
            <p> {{ module.libelle }}</p>
          </el-table-column>
          <el-table-column>
            <p>Durée du module :</p>
            <p> {{ module.dureeEnHeures }} heures</p>
          </el-table-column>
          <el-table-column>
            <p>Formation(s) :</p>
          </el-table-column>
        </el-table>-->
      </el-tab-pane>
      <el-tab-pane label="Planning" name="second">TODO PLANNING</el-tab-pane>
      <el-tab-pane label="Contraintes" name="third">
        <ContraintesModule/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as api from '../../api'
import ContraintesModule from '../ModuleD/ContraintesModule'

export default {
  name: 'InfoModule',
  components: {ContraintesModule},

  data () {
    return {
      module: [],
      activeName: 'first'
    }
  },

  created () {
    this.getModule()
  },

  methods: {
    getModule () {
      api.getModulesId(this.$route.params.id)
        .then(response => {
          this.module = response.data
        })
    },
    goBack () {
      this.$router.push('/listeModule/')
    },

    handleClick (tab, event) {
      console.log(tab, event)
    }
  }

}

</script>

<style scoped>
  #top {
    display : inline-block;
  }
</style>
