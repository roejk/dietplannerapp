import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserRegisterModel } from '../authentication.types';
import { PasswordMatchValidator } from './password-validator';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private localStorage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        repeatPassword: ['', Validators.required],
      },
      { validators: [PasswordMatchValidator('password', 'repeatPassword')] }
    );
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log('invalid form');
      return;
    }
    const data: UserRegisterModel = {
      username: this.form.controls['username'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    };

    this.loading = true;
    this.authService
      .register(data)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.localStorage.setItem('token', res.accessToken);
          this.localStorage.setItem('refreshToken', res.refreshToken);
          this.router.navigate(['']);
        },
        error: (error) => {
          console.log('register error', error);
          this.loading = false;
        },
      });
  }
}
