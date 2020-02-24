import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  serverError = '';
  cridentialsGroup: FormGroup;
  serverError$: Subscription;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.cridentialsGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]],
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
    this.authService.registerUser({...this.cridentialsGroup.value});
  }
}



