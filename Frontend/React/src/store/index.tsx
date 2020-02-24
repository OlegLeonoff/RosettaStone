import { AuthorizationStore } from './authorization';
import { TransactionsStore } from './transactions';
import { observable } from "mobx";

export class Store {
  public authorization = new AuthorizationStore();
  public transactions = new TransactionsStore();

  @observable
  public serverError = '';

  public setServerError = (error: string) => this.serverError = error;
}

export default new Store();
