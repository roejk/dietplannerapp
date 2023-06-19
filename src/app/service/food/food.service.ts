import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, tap, catchError } from 'rxjs';
import {
  Entry,
  Meal,
  MealEntryType,
  Page,
  Recipe,
} from 'src/app/component/food/food.types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private readonly apiUrl = environment.apiUrl + '/api/v1/food';

  constructor(private http: HttpClient) {}

  entries$ = (username: string) =>
    <Observable<Entry[]>>(
      this.http
        .get<Entry[]>(`${this.apiUrl}/entries?username=${username}`)
        .pipe(catchError(this.handleError))
    );

  entriesByDate$ = (username: string, date: string) =>
    <Observable<Entry[]>>(
      this.http
        .get<Entry[]>(
          `${this.apiUrl}/entries?username=${username}&date=${date}`
        )
        .pipe(catchError(this.handleError))
    );

  entryAdd$ = (entry: Entry) =>
    <Observable<Entry>>(
      this.http
        .post<Entry>(`${this.apiUrl}/entry/add`, entry)
        .pipe(catchError(this.handleError))
    );

  filterByDate$ = (date: string, response: Entry[]) =>
    <Observable<Entry[]>>new Observable<Entry[]>((subscriber) => {
      subscriber.next(
        (response = response.filter((entry) => entry.date === date))
      );
      subscriber.complete();
    });

  filterByType$ = (type: MealEntryType, response: Entry[]) =>
    <Observable<Entry[]>>new Observable<Entry[]>((subscriber) => {
      subscriber.next(
        (response = response.filter((entry) => entry.type === type))
      );
      subscriber.complete();
    });

  deleteEntry$ = (entryId: number) =>
    <Observable<number>>(
      this.http
        .delete<number>(`${this.apiUrl}/entry/delete/${entryId}`)
        .pipe(catchError(this.handleError))
    );

  meals$ = <Observable<Meal[]>>(
    this.http
      .get<Meal[]>(`${this.apiUrl}/meals`)
      .pipe(catchError(this.handleError))
  );

  mealAdd$ = (meal: Meal) =>
    <Observable<Meal>>(
      this.http
        .post<Meal>(`${this.apiUrl}/meal/add`, meal)
        .pipe(catchError(this.handleError))
    );

  mealUpload$ = (file: any) => <Observable<number>>this.http
      .post<number>(`${this.apiUrl}/meal/add/csv`, file, {
        headers: new HttpHeaders().append('enctype', 'multipart/form-data'),
      })
      .pipe(catchError(this.handleError));

  mealsByName$ = (name: string) =>
    <Observable<Meal[]>>(
      this.http
        .get<Meal[]>(`${this.apiUrl}/meals?name=${name}`)
        .pipe(catchError(this.handleError))
    );

  mealsPage$ = (page: number, size: number) =>
    <Observable<Page<Meal[]>>>(
      this.http
        .get<Meal[]>(`${this.apiUrl}/meals?page=${page}&size=${size}`)
        .pipe(catchError(this.handleError))
    );

  recipes$ = <Observable<Recipe[]>>(
    this.http
      .get<Recipe[]>(`${this.apiUrl}/recipes`)
      .pipe(catchError(this.handleError))
  );

  recipeAdd$ = (recipe: Recipe) =>
    <Observable<Recipe>>(
      this.http
        .post<Recipe>(`${this.apiUrl}/recipe/add`, recipe)
        .pipe(catchError(this.handleError))
    );

  recipesByMealId$ = (mealId: number) =>
    <Observable<Recipe[]>>(
      this.http
        .get<Recipe[]>(`${this.apiUrl}/recipes?mealId=${mealId}`)
        .pipe(catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
      () => new Error(`An error occurred - error code: ${error.status}`)
    );
  }
}
