<template>
  <v-app id="inspire">
    <div id="app">
      <Header />
      <router-view></router-view>
    </div>
  </v-app>
</template>

<script>
import Header from './components/navigation/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
