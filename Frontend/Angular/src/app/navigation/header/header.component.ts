import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { UserBalanceService } from 'src/app/user-balance.service';
import { UserBalance } from 'src/app/user-balance';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  auth$: Subscription;
  userBalance$: Subscription;
  balance$: Subscription;

  userBalance: UserBalance;

  @Output()
  sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService,
              public balanceService: UserBalanceService) { }

  ngOnInit() {
    this.auth$ = this.authService
                                .authChange$
                                .subscribe(authStatus => {
                                  this.isAuth = authStatus;
                                });
    this.userBalance$ = this.balanceService
                                       .userBalanceChange
                                       .subscribe(userBalance => this.userBalance = userBalance);
    this.balance$ = this.balanceService
                                   .balanceChange
                                   .subscribe(balance => this.userBalance.balance = balance);

    this.authService.getUserInfo();
  }

  ngOnDestroy() {
    this.auth$.unsubscribe();
    this.userBalance$.unsubscribe();
    this.balance$.unsubscribe();
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.authService.logout();
  }

  getUserBalance() {
    if (this.userBalance) {
      return this.userBalance.name + ' | ' + this.userBalance.balance;
    } else { return ''; }
  }

}
