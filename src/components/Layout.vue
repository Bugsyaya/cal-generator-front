<template>
  <div id="container">
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
  #container {
    display: flex;
  }
</style>
