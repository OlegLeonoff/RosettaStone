import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  serverError = '';
  cridentialsGroup: FormGroup;
  serverError$: Subscription;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
      this.cridentialsGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(7)
        ]]
        });
      this.serverError$ = this.authService.serverError$.subscribe(error => {
        this.serverError = error;
    });
  }

  onSubmit() {
    this.serverError = '';
    this.authService.loginUser({...this.cridentialsGroup.value});
  }
}



