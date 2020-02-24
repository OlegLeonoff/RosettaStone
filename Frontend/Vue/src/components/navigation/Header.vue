<template>
      <div>
        <v-toolbar>
        <v-app-bar-nav-icon v-if="$vuetify.breakpoint.xs" @click="drawer = !drawer">
        </v-app-bar-nav-icon>
        <v-toolbar-items>
          <v-btn to="/" text>Virtual Money</v-btn>
        </v-toolbar-items>           
          <v-spacer></v-spacer>
    
          <v-toolbar-items>
            <v-btn v-if="auth" class="disable-events" text>{{ userInfo }}</v-btn>
          </v-toolbar-items>
          <v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
            <v-btn v-if="!auth" to="/login" text>Login</v-btn>
            <v-btn v-if="!auth" to="/signup" text>Signup</v-btn>
            <v-btn v-if="auth" to="/send-money" text>Send Money</v-btn>
            <v-btn v-if="auth" to="/transactions" text>History</v-btn>
            <v-btn  v-if="auth" @click="signout" text>Signout</v-btn>
          </v-toolbar-items>
    
        </v-toolbar>
            <v-navigation-drawer
              v-model="drawer"
              absolute
              temporary
              :width="156"
            >
              <Drawer />
            </v-navigation-drawer>
      </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Drawer from './Drawer.vue'

  export default {
    name: 'Header',
    components: {
      Drawer
    },
    created () {
      this.$store.dispatch('getUserInfo', { router: this.$router, goToSendMoney: false })
    },
    methods: {
      closeDrawer() { 
        this.drawer = false; 
      },
      signout() { 
        this.$store.commit('signout', this.$router)
      }
    },
    computed: {
      ...mapState([
        'auth',
        'userName', 
        'balance'
      ]),
      userInfo () {
        let info = ''
        if(this.userName) {
          info = `${this.userName} | ${this.balance}`
        }
        return info
      }
    },
    data () {
      return {
        drawer: false
      }
    }
  }
</script>


<style scoped>
.disable-events {
  pointer-events: none
}
</style>
