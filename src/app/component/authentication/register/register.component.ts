import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { UserRegisterModel } from '../authentication.types';
import { PasswordMatchValidator } from './password-validator';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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

  onSubmit() {
    if (this.form.invalid) {
      this.errorSnackBar('Invalid form data');
      return;
    }

    const data: UserRegisterModel = {
      username: this.form.controls['username'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    };

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
          this.errorSnackBar(error.error.error);
        },
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private errorSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3 * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
