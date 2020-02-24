import { Subject } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Token } from './token.model';
import { User } from './user.model';
import { UserInfo } from '../user-info';
import { UserBalanceService } from '../user-balance.service';
import { Login } from './login.model';


@Injectable()
export class AuthService {
  authChange$ = new Subject<boolean>();
  token = '';
  serverError$ = new Subject<string>();

  private user: User;

  constructor(private router: Router,
              private http: HttpClient,
              private balanceService: UserBalanceService,
              @Inject('BASE_URL') private baseUrl: string) {
      const token = window.localStorage.getItem('token');
      if (token) { this.authChange$.next(true); }
  }

  registerUser(user: User) {
    this.user = {...user };
    const url = this.baseUrl + 'users';

    this.http
        .post<Token>(url, this.user)
        .subscribe(res => {
            if (res) {
                this.token = res.token;
                window.localStorage.setItem('token', this.token);
                this.login(user);
                this.getUserInfo();
            }},
            error => { if (error.statusText === 'Unknown Error') {
              this.serverError$.next('Network error');
            } else {
              this.serverError$.next(error.error);
            }
          });
  }

  loginUser(loginModel: Login) {
    const url = this.baseUrl + 'sessions/create';

    this.http
        .post<Token>(url, loginModel)
        .subscribe(res => {
            if (res) {
                this.token = res.token;
                window.localStorage.setItem('token', this.token);
                this.getUserInfo();
            }},
            error => { if (error.statusText === 'Unknown Error') {
                this.serverError$.next('Network error');
              } else {
                this.serverError$.next(error.error);
              }
            });
  }


  login(user: User) {
    this.user = user;
    this.authChange$.next(true);
    this.router.navigate(['/send-money']);
  }

  logout() {
    this.user = null;
    window.localStorage.removeItem('token');
    this.authChange$.next(false);
    this.router.navigate(['/login']);
  }

  getUserInfo() {
    const url = this.baseUrl + 'api/protected/userinfo';
    this.http
    .get<UserInfo>(url)
    .subscribe(res => {
        if (res) {
            const user = { username: res.name,
                           password: null,
                           email: res.email };

            this.balanceService.changeUserBalance({name: res.name, balance: res.balance});
            this.login(user);
        }},
        error => { if (error.statusText === 'Unknown Error') {
                     this.serverError$.next('Network error');
                   } else {
                     this.serverError$.next(error.error);
                   }
        });
  }

  getUser() {
    return {...this.user };
  }

  isAuth() {
    return this.user != null;
  }
}
