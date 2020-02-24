import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserBalance } from './user-balance';


@Injectable()
export class UserBalanceService {

  // private userBalanceSource = new BehaviorSubject({name: '', balance: 0});
  // userBalance = this.userBalanceSource.asObservable();
  userBalanceChange = new Subject<UserBalance>();
  balanceChange = new Subject<number>();
  constructor() { }

  changeUserBalance(ub: UserBalance) {
    this.userBalanceChange.next(ub);
  }

  changeBalance(balance: number) {
    this.balanceChange.next(balance);
  }

}
