<template>
  <v-list dense>

    <v-btn v-if="auth" to="/send-money" text>Send money</v-btn>
    <v-btn v-if="auth" to="/transactions" text>History</v-btn>
    <v-btn v-if="auth" @click="signout" text>Signout</v-btn>
    <v-btn v-if="!auth" to="/login" text>Login</v-btn>
    <v-btn v-if="!auth" to="/signup" text>Signup</v-btn>

  </v-list>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Drawer',
  data () {
      return {}
  }, 
  computed: {
    ...mapState([
      'auth'
    ])    
  },
  methods: {    
    signout() {
      this.$store.commit('signout', this.$router)
    }
  }
}
</script>

<style scoped>

.v-btn:not(.v-btn--round).v-size--default {
  min-width: 144px;
}
</style>