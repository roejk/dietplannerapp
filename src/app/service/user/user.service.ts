import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, tap, catchError } from 'rxjs';
import { User } from './user.types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = environment.apiUrl + '/api/v1/management';

  constructor(private http: HttpClient) {}

  users$ = <Observable<User[]>>(
    this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
      () => new Error(`An error occurred - error code: ${error.status}`)
    );
  }
}
