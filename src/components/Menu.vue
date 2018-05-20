<template>
  <el-row id="menuLayout">
    <el-col :span="4">
      <el-menu router default-active="2" class="grid-content el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">
            <i class="el-icon-caret-right"></i>
          </el-radio-button>
          <el-radio-button :label="true">
            <i class="el-icon-caret-left"></i>
          </el-radio-button>
        </el-radio-group>
        <el-menu-item v-for="item in items" v-bind:key="item.nom" :index="item.url">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.nom }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <!--<input id="fieldSearch" type="text"/><font-awesome-icon id="search" :icon="icon"/>-->
    <!--<ul>-->
      <!--<li v-for="item in items" v-bind:key="item.nom">-->
        <!--<a :href="item.url">-->
          <!--{{ item.nom }}-->
        <!--</a>-->
      <!--</li>-->
    <!--</ul>-->
  </el-row>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
export default {
  name: 'monMenu',
  data: () => ({
    items: [
      {nom: '', url: '/', icon: ''},
      {nom: 'Formations', url: '/formation', icon: 'el-icon-tickets'},
      {nom: 'Planning', url: '/planning', icon: 'el-icon-date'}
    ],
    isCollapse: true
  }),
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  computed: {
    icon () {
      return faSearch
    }
  },

  components: {
    FontAwesomeIcon
  }
}
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  #search{
    color: #37959D;
  }
  #menuLayout {
    height: auto;
    background-color: #99CED2;
    margin-left: 1em;
    padding: 1em;
  }
  li {
    padding: 0.2em;
  }
  a {
    color: #f3f3f3;
  }
  #fieldSearch {
    height: 1em;
  }
</style>
