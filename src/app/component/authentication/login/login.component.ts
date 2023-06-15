import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { UserLoginModel } from '../authentication.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public form!: FormGroup;
  public hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private localStorage: LocalStorageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.errorSnackBar('Invalid form data');
      return;
    }

    const data: UserLoginModel = {
      username: this.form.controls['username'].value,
      password: this.form.controls['password'].value,
    };

    this.authService
      .login(data)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.localStorage.setItem('token', res.accessToken);
          this.localStorage.setItem('refreshToken', res.refreshToken);
          this.router.navigate(['']);
        },
        error: (error) => {
          if (error.status === 403) {
            this.errorSnackBar('Invalid login or password');
          } else {
            this.errorSnackBar(error.error.error);
          }
        },
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private errorSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3 * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
