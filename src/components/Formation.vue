<template>
  <div id="formation">
    <h1>Liste des formations</h1>
    <div>
      <div v-if="loading" class="message">Reccupération des formations...</div>
    </div>
    <el-row id="calendriers">
      <el-col :span="24" v-for="formation in formations" v-bind:key="formation.codeFormation">
          <div class="grid-content" v-on:click="$router.push('/planning/' + formation.codeFormation)">{{ formation.codeFormation }} - {{ formation.libelleLong }}</div>
          <br/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'formation',

  data () {
    return {
      loaded: false,
      loading: false,
      formations: []
    }
  },

  created () {
    this.getFormation()
  },
  methods: {
    getFormation () {
      this.loading = true
      axios
        .get('http://localhost:9000/formations')
        .then(response => {
          this.formations = response.data
        })
      this.loaded = true
      this.loading = false
    }
  }
}
</script>

<style>
  #formation {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    /*color: #2c3e50;*/
    /*height: 67vh;*/
    /*width: 90vw;*/
    /*margin-left: auto;*/
    /*margin-right: auto;*/
  }

  #calendriers {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .message {
    font-size: 20px;
  }
</style>
