import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { tap, debounceTime, switchMap, finalize } from 'rxjs/operators';


import { UserResponse } from './user-response';
import { UserOption } from './user-option';
import { Transaction } from '../transaction';
import { UserBalanceService } from '../user-balance.service';
import { Router } from '@angular/router';


export function RequireMatch(control: AbstractControl) {
  const selection: any = control.value;
  if (typeof selection === 'string') {
      return { incorrect: true };
  }
  return null;
}


@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent implements OnInit, OnDestroy {
  sendMoneyGroup: FormGroup;
  filteredUsers: UserOption[] = [];
  isLoading = false;
  serverError$ = new Subject<string>();
  serverErrorStr: string;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private balanceService: UserBalanceService,
              private router: Router,
              @Inject('BASE_URL') private baseUrl: string) {}

  ngOnInit() {
    this.sendMoneyGroup = this.fb.group({
      userInput: ['', [Validators.required, RequireMatch]],
      amount: [0, [ Validators.required, Validators.pattern('[0-9]+')]]
    });

    this.serverError$.subscribe(error => this.serverErrorStr = error);

    this.sendMoneyGroup
    .get('userInput')
    .valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(value => this.search(value)
      .pipe(
        finalize(() => this.isLoading = false),
        )
      )
    )
    .subscribe(users => this.filteredUsers = users);
  }

  ngOnDestroy() {
    this.serverError$.unsubscribe();
  }

  search(filter: string): Observable<UserResponse[]> {
    if (typeof filter !== 'string') { return EMPTY; }
    return this.http
               .post<UserResponse[]>(this.baseUrl + 'api/protected/users/list', { filter })
               .pipe(tap((response: UserResponse[]) => {
                  response = response.map(user => new UserOption(user.id, user.name))
                                     .filter(user => user.name.toLowerCase().startsWith(filter.toLowerCase()));

                  return response;
            })
         );
  }

  displayFn(user: UserOption) {
    if (user) { return user.name; }
  }

  onSubmit() {
    this.serverErrorStr = '';
    const url = this.baseUrl + 'api/protected/transactions';
    this.http
    .post<Transaction>(url, {name: this.sendMoneyGroup.get('userInput').value.name, // TODO: put?
                            amount: this.sendMoneyGroup.get('amount').value})
    .subscribe(res => {
        this.sendMoneyGroup.get('amount').setValue('0');
        if (res) {
          this.balanceService.changeBalance(res.transaction.balance);
        }},
        error => { if (error.statusText === 'Unknown Error') {
                      this.serverError$.next('Network error');
                   } else {
                      this.serverError$.next(error.error);
                   }
                 }
              );
  }
}
