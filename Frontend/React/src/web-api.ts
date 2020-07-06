import axios from 'axios';
import { ISignupData, IUserInfo, ILoginData, 
         ITransactionData, INameAndId, ITransaction} from './interfaces';
import moment from 'moment';


class WebApi {

  _axios = axios;

  constructor() {
    this._axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:55341';
    this._axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
    this._axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  }

  public setJwtToken (token: string) { 
    this._axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public getUserInfo = async (): Promise<IUserInfo> => {
    try {
      const  response = await this._axios({
        method: 'GET',
        url: '/api/protected/userinfo',
      });
      const {name, balance} = response.data;
      return {name, balance: Number(balance)};
    }
    catch(error) {
      throw error;
    }
  }

  public signup = async (signupData: ISignupData): Promise<string> => {
    try {
      let response = await this._axios({
        method: 'POST',
        url: '/users',
        data: signupData,
      });
      return response.data.token;
    }
    catch(error) {
      throw error;
    }
  }

  public login = async (loginData: ILoginData): Promise<string> => {
    try {
      const  response = await this._axios({
        method: 'POST',
        url: '/sessions/create',
        data: loginData,
      })
      return response.data.token;
    }
    catch(error) {
      throw error;
    }
  }

  public getFilteredUsers = async (filter: string): Promise<INameAndId[]> => {
    try {
      const res = await this._axios.post('/api/protected/users/list', { filter });
      return res.data;
    }
    catch (error) {
      throw error;
    }
  }
  public sendMoney = async (transactionData: ITransactionData): Promise<ITransaction> => {
    try{
      const response = await this._axios({
        method: 'POST',
        url: '/api/protected/transactions',
        data: transactionData,
      })
      return response.data.transaction;       
    }
    catch(error){
      throw error;
    }
  }

  public getTransactions = async (): Promise<ITransaction[]> => {
    try{
      const res = await this._axios({
        method: 'GET',
        url: '/api/protected/transactions',
      }) 
      const transactions: ITransaction[] = res.data.transactions;    
      const finalTransactions = transactions.map(t => {
        return {...t, date: moment(String(t.date)).format('DD/MM/YYYY hh:mm:ss')}
      })
      return finalTransactions;
    }
    catch(error){
      throw error;
    }
  }
}

export default new WebApi();