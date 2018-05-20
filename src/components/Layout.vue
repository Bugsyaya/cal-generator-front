<template>
  <div>
    <MenuLayout />
    <slot />
  </div>
</template>

<script>
import MenuLayout from './Menu'
export default {
  name: 'Layout',
  components: {MenuLayout}
}
</script>

<style>
  #test {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
