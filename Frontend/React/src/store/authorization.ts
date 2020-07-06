import { decorate, observable, computed, action } from "mobx";
import { IUserInfo, ILoginData, ISignupData, INameAndId } from '../interfaces';
import webApi from '../web-api'


export class AuthorizationStore {

  @observable
  public auth = false;
  
  @observable
  public serverError = '';

  @observable
  public token = '';
  
  @observable
  userInfo: IUserInfo = {name: '', balance: 0};

  @observable
  public usersFilter = '';

  @observable
  public filteredUsers: INameAndId[] = [];

  @action.bound
  public setBalance (balance: number) {
    this.userInfo.balance = balance;
  }

  @action.bound
  public authorizeAndSetUserInfo (userInfo: IUserInfo) {
    this.auth = true;
    this.userInfo = userInfo;
  }
  
  @action.bound
  public authorize () {
    this.auth = true;
  }

  @action.bound
  public unauthorize () {
    this.auth = false;
  }

  @action.bound
  public setServerError (error: string) {
    this.serverError = error;
  }

  @action.bound
  public async login (loginData: ILoginData) {
    try {
        const token = await webApi.login(loginData);
        if(token) {
          webApi.setJwtToken(token);
          this.setToken(token);
          localStorage.setItem("jwtToken", token);
          this.authorize();
          const userInfo = await this.getUserInfo(token);
          if(userInfo) {
            this.setUserInfo(userInfo);
          }
        }
    }
    catch (error) {
      throw error;
    }
  }

  @action.bound
  public async signup (signupData: ISignupData) {
    try {
        const token = await webApi.signup(signupData);
        if(token) {
          webApi.setJwtToken(token);
          this.setToken(token);
          localStorage.setItem("jwtToken", token);
          this.authorize();
          const userInfo = await this.getUserInfo(token);
          if(userInfo) {
            this.setUserInfo(userInfo);
          }
        }
    }
    catch (error) {
      throw error;
    }
  }
  
  @action.bound
  public async getUserInfo (token: string) {
    if(token) {
      webApi.setJwtToken(token);
    }
    try {
      const userInfo = await webApi.getUserInfo();
      return userInfo;
    }
    catch (error) {
      throw error;
    }
  }

  @action.bound
  public setToken (token: string) {
    this.token = token;
  }

  @action.bound
  public setUserInfo (userInfo: IUserInfo) {
    this.userInfo = userInfo;
  }

  @computed
  get userInfoString (): string {
    return this.auth ? 
      `${this.userInfo.name} | ${this.userInfo.balance}` :
      '';
  }

}
