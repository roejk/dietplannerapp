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
import { MatDialog } from '@angular/material/dialog';
import { AddEntryDialogComponent } from './add-dialog/add-dialog.component';
import * as moment from 'moment';
import { TokenDecoderService } from 'src/app/service/token-decoder/token-decoder.service';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css'],
})
export class MealPlanComponent implements OnInit {
  private username = this.decoder.getUsernameFromToken();
  appState$: Observable<AppState<Entry[]>>;
  splittedData$: Observable<AppState<Entry[]>>[] = [];
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<Entry[]>(null);
  readonly types = Object.values(MealEntryType);
  displayedColumns: string[] = [
    'meal',
    'calories',
    'proteins',
    'fats',
    'carbohydrates',
    'amount',
    'add',
  ];
  readonly dates: string[] = [];
  selectedDate: string;
  totals = { calories: 0, proteins: 0, fats: 0, carbohydrates: 0, amount: 0 };

  constructor(
    private mealPlanService: MealPlanService,
    public dialog: MatDialog,
    private decoder: TokenDecoderService
  ) {}

  ngOnInit(): void {
    for (let i = 7; i > 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i + 1);
      this.dates.push(formatDate(date, 'yyyy-MM-dd', 'en'));
    }
    this.selectedDate = this.dates.at(-1);

    this.appState$ = this.mealPlanService
      .entriesByDate$(this.selectedDate)
      .pipe(
        map((response) => {
          response.forEach((entry) => {
            this.countTotals(entry);
          });
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

  countTotals(entry: Entry) {
    this.totals.calories += entry.meal.calories;
    this.totals.proteins += entry.meal.proteins;
    this.totals.fats += entry.meal.fats;
    this.totals.carbohydrates += entry.meal.carbohydrates;
    this.totals.amount += entry.amount;
  }

  resetTotals() {
    this.totals.calories = 0;
    this.totals.proteins = 0;
    this.totals.fats = 0;
    this.totals.carbohydrates = 0;
    this.totals.amount = 0;
  }

  filterEntriesByDate(date: string) {
    this.resetTotals();
    this.selectedDate = moment(date).format('yyyy-MM-DD').toString();
    this.appState$ = this.mealPlanService
      .entriesByDate$(this.selectedDate)
      .pipe(
        map((response) => {
          response.forEach((entry) => {
            this.countTotals(entry);
          });
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

  addEntry(type: any) {
    console.log('add', type);
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      data: { mealId: null, amount: null },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.mealPlanService
        .entryAdd$({
          mealId: result.mealId,
          date: this.selectedDate,
          type: type,
          amount: result.amount,
          username: this.username,
        })
        .pipe(finalize(() => this.filterEntriesByDate(this.selectedDate)))
        .subscribe((x) => console.log(x));
    });
  }

  deleteEntry(id: number) {
    this.mealPlanService
      .deleteEntry$(id)
      .pipe(finalize(() => this.filterEntriesByDate(this.selectedDate)))
      .subscribe((x) => console.log(x));
  }
}
