<template>
  <div>
    <h1 id="alerte">Alertes</h1><el-row id="calendriers">
      <el-col :span="24" v-for="calendrier in calendriers" v-bind:key="calendrier.idCalendrier">
        <div class="grid-content" @click="redir(calendrier.idCalendrier, calendrier.codeFormation)">
          {{ calendrier.titre }} - {{ calendrier.description }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as api from '../api'
export default {
  name: 'alerte',

  data () {
    return {
      loaded: false,
      loading: false,
      calendriers: []
    }
  },
  created () {
    this.getAlerte()
  },
  methods: {
    redir (idCalendrier, codeFormation) {
      window.location.href = window.origin + '/planning/' + codeFormation + '/details/' + idCalendrier
    },
    getAlerte () {
      this.loading = true
      api.synchronise().then(response => {
        this.calendriers = response.data
      })
      this.loaded = true
      this.loading = false
    }
  }
}
</script>

<style>

</style>
