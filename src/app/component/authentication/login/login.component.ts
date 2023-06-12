import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
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

    this.loading = true;
    this.authService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.localStorage.setItem('token', res.accessToken);
          this.localStorage.setItem('refreshToken', res.refreshToken);
          this.router.navigate(['']);
        },
        error: (error) => {
          if (error.status === 403) {
            console.log('wrong password', error); //todo: modal or something
          }
          console.log('login error', error);
          this.loading = false;
        },
      });
  }
}
