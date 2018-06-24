<template>
  <el-transfer
    filterable
    v-model="value"
    :data="data2"
    :titles="['Modules Non Requis', 'Modules Requis']">
  </el-transfer>
</template>

<script>
  import axios from 'axios'


  export default {

    name: "ContraintesModules",

    data() {
      return {
        module: [],
        value: [],
        data2: []
      };
    },

    created () {
      this.getListeModule()
    },

    methods: {
      getListeModule () {
        axios
          .get('http://localhost:9000/modules')
          .then(response => {
            this.module = response.data
            this.module.forEach((name, index) => {
              this.data2.push({
                label: name.libelle,
                key: index
              });
              console.log('test4', name.libelle)
            });
          });

/*          this.module.forEach((name, index) => {
            this.data2.push({
              label: name,
              key: index
            });
          });
        console.log('test2', this.data2);*/
      }

      /*generateData () {
        console.log('test');
        const data = [];
        this.module.forEach((name, index) => {
          data.push({
            label: name,
            key: index
          });
        });
        return data;
      },*/
    }
  }
</script>
