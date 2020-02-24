<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Send Money To</h3>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet
          elevation="12"
          class="mx-auto pa-8"
          max-width="400px"
        >
          <v-form ref="form" >
          <v-row>
            <v-col class="py-0" color="red lighten-2">              
        <v-autocomplete
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          :rules="recipientRules"
          :menu-props="menuProps"
          color="white"
          hide-no-data
          hide-selected
          item-text="name"
          item-value="id"
          validate-on-blur
          label="users"
          placeholder="Start typing to Search"
          return-object
        ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="py-0">
                <v-text-field
                  class="amount"
                  v-model="amount"
                  single-line
                  type="number"
                  min="1"
                  :rules="amountRules"
                />
                <div class="serverError my-2" v-if="errorFromServer">
                  {{ errorFromServer }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="primary" @click="submit">Send</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import store from '../store'
import { mapState } from 'vuex'

export default {
  name: 'SendMoney',
  data: () => ({
    users: [],
    recipient: '',
    isLoading: false,
    model: null,
    search: null,
    amount: '10',
    menuProps: {
        auto: true,
        closeOnClick: true,
        closeOnContentClick: true
      },
  }),

  methods: {
    isPositiveInteger(str) {
      const n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n > 0;
    },
    submit() {
      if(this.$refs.form.validate()) {
        this.$store.dispatch('sendMoney', { name: this.model.name, amount: Number(this.amount) })
      }
    }
  },   

  computed: {
    ...mapState([
        'errorFromServer'
      ]),
    items () {
      return this.users
    },
    amountRules () {
        const rules = []       
        rules.push(v => this.isPositiveInteger(v) || 'amount should be a positive integer')
        return rules
      },
      recipientRules () {
        const rules = []
        rules.push(v => !!v || 'recipient should be selected')
        return rules
      }
  },

  watch: {
    async search (val) {
      if(!val) {
        this.users = []
        this.model = null // clean up previous selected recipient
        return 
      }
      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      try {
        const res = await axios.post('/api/protected/users/list', {filter: val})
        this.users = res.data
      }
      catch(err) {
          store.commit('setErrorFromServer', err)
      }
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.serverError {
  color: #ff5252;
  text-align: left;
  font-size: 12px;
  padding-left: 92px;
}
.v-application .white--text { /* to overwrite not very adequate vuetify styles */
  color: #000!important;
  caret-color: #000!important;
}

.amount {
  width: 150px;
  margin: 0 auto;
}
</style>
