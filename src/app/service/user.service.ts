import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, tap, catchError } from 'rxjs';
import { CustomResponse } from '../interface/custom-response';
import { UserRole } from '../enum/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/management';

  constructor(private http: HttpClient) {}

  users$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/users`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  filter$ = (role: UserRole, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      subscriber.next({
        ...response,
        message:
          response.data.users.filter((user) => user.userRole === role).length >
          0
            ? `Users filtered by 
            ${role === UserRole.ADMIN ? 'ADMIN' : 'USER'} role`
            : `No users of ${role} role found`,
        data: {
          users: response.data.users.filter((user) => user.userRole === role),
        },
      });
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
      () => new Error(`An error occurred - error code: ${error.status}`)
    );
  }
}
