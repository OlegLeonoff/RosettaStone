import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';

import axios from './axios';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    auth: false,
    token: '',
    errorFromServer: '',
    userName: '',
    balance: 0,
    users: [],
    transactions: []
  },
  mutations: {
    authorize(state) {
      state.auth = true
    },
    unauthorize(state) {
      state.auth = false
    },
    setToken(state, token) {
      state.auth = true
      state.token = token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem("jwtToken", token)
    },
    setErrorFromServer(state, errorFromServer) {
      state.errorFromServer = errorFromServer
    },
    signout(state, router) {
      state.auth = false
      localStorage.removeItem("jwtToken")
      router.push('/login')   
    },
    setUserInfo(state, userInfo) {
      state.userName = userInfo.name
      state.balance = userInfo.balance
    },
    setTransactions(state, transactions) {
      const finalTransactions = transactions.map(t => {return {...t, date: moment(String(t.date)).format('DD/MM/YYYY hh:mm:ss')}})
      state.transactions = finalTransactions
    },
  },
  actions: {   
    async getUserInfo(store, payload) {
      const {router, goToSendMoney} = payload
      try{
        const token = localStorage.getItem("jwtToken")
        if(token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        const  response = await axios({
          method: 'GET',
          url: '/api/protected/userinfo',
        })
        store.commit('authorize')
        store.commit('setUserInfo', response.data)       
        if(goToSendMoney) {
          router.push('/send-money')
        }
      }
      catch(err){
          store.commit('unauthorize')
          localStorage.removeItem("jwtToken")
          const path = router.currentRoute.path
          if(path !== '/login' && 
             path !== '/signup'&&
             path !== '/' 
             ) {
              router.push('/login')
             }
      }
    },
    async changeUserInfo(store) {
      try{
        const  response = await axios({
          method: 'GET',
          url: '/api/protected/userinfo',
        })
        store.commit('setUserInfo', response.data)       
      }
      catch(err){
          localStorage.removeItem("jwtToken")
      }
    },
    async signup(store, payload) {
      const { userData, router, goToSendMoney } = payload
      try{
        const  response = await axios({
          method: 'POST',
          url: '/users',
          data: userData,
        })
        store.commit('setToken', response.data.token)
        store.dispatch('getUserInfo', {router, goToSendMoney})
      }
      catch(err){
          store.commit('setErrorFromServer', err.response?.data || err.message);
      }
    },
    async login(store, payload) {
      const { userData, router, goToSendMoney } = payload
      try{
        const  response = await axios({
          method: 'POST',
          url: '/sessions/create',
          data: userData,
        })
        store.commit('setToken', response.data.token)
        store.dispatch('getUserInfo', {router, goToSendMoney})
      }
      catch(err){
          store.commit('setErrorFromServer', err.response?.data || err.message);
      }
    },
    async sendMoney(store, transactionData) {
      try{
        await axios({
          method: 'POST',
          url: '/api/protected/transactions',
          data: transactionData,
        })
        store.dispatch('changeUserInfo')       
      }
      catch(err){
          store.commit('setErrorFromServer', err.response?.data || err.message);
      }
    },
    async getTransactions(store) {
      try{
        const res = await axios({
          method: 'GET',
          url: '/api/protected/transactions',
        }) 
        store.commit('setTransactions', res.data.transactions);     
      }
      catch(err){
          store.commit('setErrorFromServer', err.response?.data || err.message);
      }
    }
  }
})