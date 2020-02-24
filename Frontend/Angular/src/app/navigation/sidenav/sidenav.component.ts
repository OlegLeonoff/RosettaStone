import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  isAuth = false;
  auth$: Subscription;

  @Output()
  sidenavClose = new EventEmitter();
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.auth$ = this.authService.authChange$.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  ngOnDestroy() {
    this.auth$.unsubscribe();
  }

  close() {
    this.sidenavClose.emit();
  }

  logout() {
    this.authService.logout();
    this.sidenavClose.emit();
  }
}
