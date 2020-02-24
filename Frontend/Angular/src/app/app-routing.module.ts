import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'send-money', component: SendMoneyComponent, canActivate: [AuthGuard] },
  { path: 'history', component: TransactionsHistoryComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
