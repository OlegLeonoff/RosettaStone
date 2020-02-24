<template>
  <v-container>

    <v-row>
      <v-col>
        <h3>Transactions</h3>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet
          elevation="12"
          class="mx-auto pa-8"
          max-width="700px"
        > 
          <v-data-table
            :headers="headers"
            :items="transactions"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </v-sheet>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  import { mapState } from 'vuex';


export default {
  name: 'Transactions',
  created () {
      this.$store.dispatch('getTransactions')
    },

  computed: {
      ...mapState([
        'transactions'
      ])
  },

  data: () => ({
     headers: [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'id',
        },
        { text: 'Date', value: 'date' },
        { text: 'Name', value: 'username' },
        { text: 'Amount', value: 'amount' },
        { text: 'Balance', value: 'balance' },
      ]  
  })
}
</script>

<style scoped>
</style>
