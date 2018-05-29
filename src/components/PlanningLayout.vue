<template>
  <el-row id="planningLayout">
    <h1>Planning pour {{ this.$route.params.id }}</h1>
    <el-steps :space="200" :active="1" finish-status="success">
      <el-step title="Done"></el-step>
      <el-step title="Processing"></el-step>
      <el-step title="Step 3"></el-step>
    </el-steps>
    <el-tabs tab-position="top">
    <el-tab-pane label="Planning">
      <Planning/>
    </el-tab-pane>
    <el-tab-pane label="Contraintes">
      <Contraintes/>
    </el-tab-pane>
    <el-tab-pane label="Modules">
      <Modules/>
    </el-tab-pane>
    <el-tab-pane label="Historique">Historique</el-tab-pane>
  </el-tabs>

    </el-row>
</template>

<script>
import Planning from './Planning'
import Contraintes from './Contrainte'
import Modules from './Module'
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these as you would normally for CSS files. Both of these
// CSS files are optional, you can create your own theme if you prefer.
require('vue-simple-calendar/dist/static/css/default.css')
require('vue-simple-calendar/dist/static/css/holidays-us.css')

export default {
  name: 'planningLayout',
  components: {Planning, Contraintes, Modules}
}
</script>

<style>
#planningLayout {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  flex: 1;
}

#calendriers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

form {
  margin: 2em;
}

table {
  margin: 1em;
  border: 1px #ddd solid;
  box-shadow: #eee 5px 5px 5px;
  border-spacing: 0;
  border-collapse: collapse;
}

tr:hover {
  background: #eee;
}

td,
th {
  padding: 0.5em 1em;
}

th {
  border-bottom: #bbb solid 1px;
  background-color: #ddd;
}

td:nth-child(1),
th:nth-child(1) {
  text-align: left;
}

tr.total {
  background-color: #ddd;
}

.message {
  font-size: 20px;
}

label {
  margin: 1em;
}
</style>
