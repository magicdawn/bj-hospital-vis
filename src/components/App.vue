<template lang="html">
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './layout/header.vue'

export default {
  components: {Header},
}
</script>

<style lang="css" scoped></style>
