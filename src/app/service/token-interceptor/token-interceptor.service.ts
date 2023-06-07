import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  private refreshingInProgress = false;
  private accessTokenSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.localStorageService.getItem('token');

    return next.handle(this.addAuthorizationHeader(req, accessToken)).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          const refreshToken = this.localStorageService.getItem('refreshToken');
          if (refreshToken && accessToken) {
            return this.refreshToken(req, next);
          }
          return this.logoutAndRedirect(err);
        }
        if (err instanceof HttpErrorResponse && err.status === 403) {
          return this.logoutAndRedirect(err);
        }
        return throwError(err);
      })
    );
  }

  refreshToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      this.accessTokenSubject.next('');

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.refreshingInProgress = false;
          this.accessTokenSubject.next(res.accessToken);
          return next.handle(
            this.addAuthorizationHeader(request, res.accessToken)
          );
        })
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addAuthorizationHeader(request, token));
        })
      );
    }
  }

  private logoutAndRedirect(
    err: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    this.authService.logout();
    this.router.navigateByUrl('/login');

    return throwError(err);
  }

  private addAuthorizationHeader(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    if (token && request.url != '/token-refresh') {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    const refreshToken = this.localStorageService.getItem('refreshToken');
    if (refreshToken && request.url === '/token-refresh') {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${refreshToken}` },
      });
    }
    return request;
  }
}
