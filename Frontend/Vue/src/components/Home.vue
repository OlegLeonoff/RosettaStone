<template>
  <v-container>

    <v-row>
      <v-col>
        <h3>Virtual Money</h3>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-sheet
          elevation="12"
          class="mx-auto pa-8"
          max-width="700px"
        > <v-row>
            <v-col>
              <img 
                alt="Virtual Money" 
                src="http://en.finance.sia-partners.com/sites/default/files/styles/700x400/public/post/visuels/istock_000046835322_medium_3.jpg?itok=r7d2N5R_"
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="text-justify">
                This is a 'Virtual Money' system.
                Users can send to each other an amount of virtual money.
                Each user from the beginning has 500 units on his balance.
              </p>
              <p class="text-justify">
                Each transaction is stored in database and can be viewed on '/transactions' page.  
                This project demonstrates a way to communicate between backend and frontend being protected by an autorization token.
                During the login process frontend recieves that token and after that constantly sends this token in headers in all successive requests.
              </p>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container> 
 </template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>


