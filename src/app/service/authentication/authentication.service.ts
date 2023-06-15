import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  Subscription,
  catchError,
  interval,
  tap,
  throwError,
} from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { DecodedToken } from '../token-decoder/token-decoder.service';
import jwt_decode from 'jwt-decode';
import {
  LoginResponse,
  UserLoginModel,
  UserRegisterModel,
} from 'src/app/component/authentication/authentication.types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  apiUrl = 'http://localhost:8080/api/v1/auth';
  tokenSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(user: UserLoginModel): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, user)
      .pipe(tap(() => this.runCheckTokenExpired()));
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, { responseType: 'text' as 'json' })
      .subscribe();
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('refreshToken');
    this.tokenSubscription?.unsubscribe();
  }

  register(user: UserRegisterModel) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, user);
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .get<{ accessToken: string; refreshToken: string }>(
        `${this.apiUrl}/refresh-token`
      )
      .pipe(
        tap((response) => {
          this.setToken('token', response.accessToken);
          this.setToken('refreshToken', response.refreshToken);
        })
      );
  }

  isAdmin(): boolean {
    return this.getAuthority() === 'ROLE_ADMIN';
  }

  private setToken(key: string, token: string): void {
    this.localStorageService.setItem(key, token);
  }

  private runCheckTokenExpired() {
    const source = interval(2 * 60 * 1000);
    this.tokenSubscription = source.subscribe(() => this.checkIsLoggedIn());
  }

  private checkIsLoggedIn() {
    const refreshToken = this.localStorageService.getItem('refreshToken');
    const refreshDecoded: DecodedToken = jwt_decode(refreshToken);

    if (this.localStorageService.checkIfTokenExpired(refreshDecoded)) {
      this.logout();
    }
  }

  private getAuthority() {
    const token = this.localStorageService.getItem('token');
    const tokenDecoded: DecodedToken = jwt_decode(token);

    return tokenDecoded.authorities[0]['authority'];
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
