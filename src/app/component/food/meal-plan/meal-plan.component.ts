import { Component, OnInit } from '@angular/core';
import {
  Observable,
  catchError,
  map,
  of,
  startWith,
  tap,
  BehaviorSubject,
  finalize,
} from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { MealPlanService } from 'src/app/service/food/food.service';
import { Entry, MealEntryType } from '../food.types';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css'],
})
export class MealPlanComponent implements OnInit {
  appState$: Observable<AppState<Entry[]>>;
  splittedData$: Observable<AppState<Entry[]>>[] = [];
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<Entry[]>(null);
  readonly types = Object.values(MealEntryType);
  displayedColumns: string[] = ['meal', 'date', 'amount'];
  readonly dates: string[] = [];

  constructor(private mealPlanService: MealPlanService) {}

  ngOnInit(): void {
    for (let i = 7; i > 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i + 1);
      this.dates.push(formatDate(date, 'yyyy-MM-dd', 'en'));
    }

    this.appState$ = this.mealPlanService
      .entriesByDate$(this.dates.at(-1))
      .pipe(
        map((response) => {
          this.dataSubject.next(response);
          return {
            dataState: DataState.LOADED_STATE,
            appData: response,
          };
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error: error });
        }),
        finalize(() => {
          this.splitEntriesByType();
        })
      );
  }

  filterEntriesByDate(event) {
    this.appState$ = this.mealPlanService.entriesByDate$(event.value).pipe(
      map((response) => {
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED_STATE,
          appData: response,
        };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      }),
      finalize(() => {
        this.splitEntriesByType();
      })
    );
  }

  splitEntriesByType() {
    for (let i = 0; i < this.types.length; i++) {
      this.splittedData$[i] = this.mealPlanService
        .filterByType$(this.types[i], this.dataSubject.value)
        .pipe(
          map((response) => {
            return {
              dataState: DataState.LOADED_STATE,
              appData: response,
            };
          }),
          startWith({
            dataState: DataState.LOADED_STATE,
            appData: this.dataSubject.value,
          }),
          catchError((error: string) => {
            return of({ dataState: DataState.ERROR_STATE, error });
          })
        );
    }
  }
}
