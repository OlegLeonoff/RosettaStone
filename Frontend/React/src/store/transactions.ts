import { decorate, observable, computed, action } from "mobx";
import webApi from '../web-api';
import { INameAndId } from '../interfaces';
import { ITransactionData, ITransaction } from '../interfaces';


export class TransactionsStore {

  @observable
  public transactions: ITransaction[] = []; 

  @action.bound
  public async sendMoney(transactionData: ITransactionData) {
    try{
      const transactionResult = await webApi.sendMoney(transactionData);
      return transactionResult;  
    }
    catch(err){
      throw err;
    }
  }

  @action.bound
  public async getTransactions() {
    try{
      const result = await webApi.getTransactions();
      this.transactions = result;
   
    }
    catch(err){
      throw err;
    }
  }
}