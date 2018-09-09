<template>
  <div id="headerPlanning">
    <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="12">
              <h1 align="center" id="titre">{{ title }}</h1>
              <h2 align="center" id="desc">{{ description }}</h2>
            </el-col>
            <el-col :span="12">
              <el-steps :space="200" :active="number" finish-status="success" align-center class="positionInformation">
                <el-step title="Génération" icon="el-icon-setting"></el-step>
                <el-step title="En cours" icon="el-icon-edit"></el-step>
                <el-step title="Vérifié" icon="el-icon-view"></el-step>
                <el-step title="Téléchargé" icon="el-icon-download"></el-step>
              </el-steps>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
  name: 'headerPlanning',
  props: {
    number: Number,
    title: String,
    description: String
  }
}
</script>

<style>
#headerPlanning h1{
  padding-bottom: 0em;
}
</style>
