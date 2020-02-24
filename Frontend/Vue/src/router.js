import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './components/Home.vue'
import SignUp from './components/SignUp.vue'
import Login from './components/Login.vue'
import SendMoney from './components/SendMoney.vue'
import Transactions from './components/Transactions.vue'
import Page404 from './components/Page404.vue'

Vue.use(VueRouter);

const router = new VueRouter ({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/signup',
      component: SignUp,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/send-money',
      component: SendMoney,
    },
    {
      path: '/transactions',
      component: Transactions,
    },
    {
      path: '*',
      component: Page404,
    }
  ]
})


export default router
