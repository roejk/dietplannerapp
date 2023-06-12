import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, tap, catchError } from 'rxjs';
import {
  Entry,
  Meal,
  MealEntryType,
  Recipe,
} from 'src/app/component/food/food.types';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/food';

  constructor(private http: HttpClient) {}

  entries$ = (username: string) =>
    <Observable<Entry[]>>(
      this.http
        .get<Entry[]>(`${this.apiUrl}/entries/${username}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  entriesByDate$ = (username: string, date: string) =>
    <Observable<Entry[]>>(
      this.http
        .get<Entry[]>(`${this.apiUrl}/entries/${username}/${date}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  entryAdd$ = (entry: Entry) =>
    <Observable<Entry>>(
      this.http
        .post<Entry>(`${this.apiUrl}/entry/add`, entry)
        .pipe(tap(console.log), catchError(this.handleError))
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
        .pipe(tap(console.log), catchError(this.handleError))
    );

  meals$ = <Observable<Meal[]>>(
    this.http
      .get<Meal[]>(`${this.apiUrl}/meals`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  mealsByName$ = (name: string) =>
    <Observable<Meal>>(
      this.http
        .get<Meal[]>(`${this.apiUrl}/meals/${name}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  mealAdd$ = (meal: Meal) =>
    <Observable<Meal>>(
      this.http
        .post<Meal>(`${this.apiUrl}/meal/add`, meal)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  recipes$ = <Observable<Recipe[]>>(
    this.http
      .get<Recipe[]>(`${this.apiUrl}/recipes`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  recipeAdd$ = (recipe: Recipe) =>
    <Observable<Recipe>>(
      this.http
        .post<Recipe>(`${this.apiUrl}/recipe/add`, recipe)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(
      () => new Error(`An error occurred - error code: ${error.status}`)
    );
  }
}
