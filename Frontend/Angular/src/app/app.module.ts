import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { environment } from '../environments/environment';
import { UserBalanceService } from './user-balance.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/jwt.interceptor';
import { AuthResponseInterceptor } from './auth/auth-response-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    SendMoneyComponent,
    TransactionsHistoryComponent,
    HomeComponent,
    HeaderComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthService,
              UserBalanceService,
              { provide: 'BASE_URL', useFactory: getBaseUrl },
              {
                  provide: HTTP_INTERCEPTORS,
                  useClass: TokenInterceptor,
                  multi: true
              },
              {
                  provide: HTTP_INTERCEPTORS,
                  useClass: AuthResponseInterceptor,
                  multi: true
              }
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl() {
  return environment.baseUrl ?
         environment.baseUrl :
         document.getElementsByTagName('base')[0].href;
}
