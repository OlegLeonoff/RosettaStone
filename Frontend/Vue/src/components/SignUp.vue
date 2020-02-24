<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Signup</h3>
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
            <v-col>              
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Name"
                  validate-on-blur
                  type="text"
                  prepend-icon="person"
                  counter="20"
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Email"
                  prepend-icon="email"
                  validate-on-blur
                  type="email"
                  counter="20"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  validate-on-blur
                  prepend-icon="lock"
                  type="password"
                  counter="20"
                ></v-text-field>
                <v-text-field
                  v-model="password2"
                  :rules="password2Rules"
                  label="Confirm password"
                  validate-on-blur
                  prepend-icon="lock"
                  type="password"
                  counter="20"
                ></v-text-field>
                <div class="serverError mt-2" v-if="errorFromServer">
                  {{ errorFromServer }}
                </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right mt-2 mb-0">
                <v-btn color="primary" @click="submit">Signup</v-btn> 
            </v-col>
          </v-row>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

const commonRules = [
  v => !!v || 'Field is required',
  v => ((v || '').length <= 20) ||`A maximum of 20 characters is allowed`
]

export default {
  name: 'SignUp',
 data: () => ({
      valid: true,
      name: '',
      email: '',
      password: '',
      min: 7,
      max: 20,
      password2: '',
    }),

    computed: {
      ...mapState([
        'errorFromServer'
      ]),
      emailRules () {
        const rules = [...commonRules]
        // if first clause == false then we have second clause (i.e. message string)
        
        rules.push(v => /.+@.+/.test(v) || 'Invalid Email address')
        return rules
      },
      passwordRules () {
        const rules = [...commonRules]

        if (this.min) {
          const rule = v => ((v || '').length >= this.min) || `A minimum of ${this.min} characters is allowed` 
          rules.push(rule)
        }

        const onlyLatinRule = v => !v.match(/[^a-zA-Z\-_0-9]/g) ||
            'Password should contain latin letters, hyphen, underscores and digits only'
        rules.push(onlyLatinRule)

        const rule = v => (!!v.match(/[0-9]/g) && !!v.match(/[a-z]/g) && !!v.match(/[A-Z]/g)) ||
            'At least one digit, one lowercase and one uppercase letter'
        rules.push(rule)

        const noSpaceRule = v => (v || '').indexOf(' ') === -1 ||
            'No spaces are allowed'
        rules.push(noSpaceRule)

        return rules
      },
      password2Rules () {
        const rules = [...commonRules]
        if (this.password) {
          const rule = v => (!!v && v) === this.password ||
            'Values do not match'
          rules.push(rule)
        }
        return rules
      },
      nameRules () {
        const rules = [...commonRules]
        rules.push(v => (v.indexOf(' ') === -1) || 'Spaces not allowed')
        return rules
      }
    },

    methods: {
      submit () {
        if(this.$refs.form.validate()) {
          this.$store.commit('setErrorFromServer', '')
          const userData = {name: this.name, email: this.email, password: this.password}
          const router = this.$router
          this.$store.dispatch('signup', {userData, router, goToSendMoney: true})
        }
      }
    },
}
</script>

<style scoped>
.serverError {
  color: #ff5252;
  text-align: left;
  font-size: 12px;
  padding-left: 34px;
}
</style>
