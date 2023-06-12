import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EntryDialogData, Meal } from '../food.types';
import { AppState } from 'src/app/interface/app-state';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
  startWith,
} from 'rxjs';
import { FoodService } from 'src/app/service/food/food.service';
import { MatDialog } from '@angular/material/dialog';
import { DataState } from 'src/app/enum/data-state.enum';
import { AddMealDialogComponent } from './add-meal-dialog/add-meal-dialog.component';
import { AddEntryDialogComponent } from '../meal-plan/add-entry-dialog/add-entry-dialog.component';
import { TokenDecoderService } from 'src/app/service/token-decoder/token-decoder.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss'],
})
export class MealsComponent implements OnInit, AfterViewInit {
  private username = this.decoder.getUsernameFromToken();
  // appState$: Observable<AppState<Meal[]>>;
  // readonly DataState = DataState;
  // private dataSubject = new BehaviorSubject<Meal[]>(null);
  dataSource: MatTableDataSource<Meal> = new MatTableDataSource();
  displayedColumns: string[] = [
    'meal',
    'calories',
    'proteins',
    'fats',
    'carbohydrates',
    'add',
  ];

  constructor(
    private foodService: FoodService,
    public dialog: MatDialog,
    private decoder: TokenDecoderService
  ) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadData() {
    // this.appState$ = this.foodService.meals$.pipe(
    //   map((response) => {
    //     this.dataSubject.next(response);
    //     return {
    //       dataState: DataState.LOADED_STATE,
    //       appData: response,
    //     };
    //   }),
    //   startWith({ dataState: DataState.LOADING_STATE }),
    //   catchError((error: string) => {
    //     return of({ dataState: DataState.ERROR_STATE, error: error });
    //   })
    // );

    this.foodService.meals$.subscribe((x) => (this.dataSource.data = x));
  }

  addMeal() {
    const dialogRef = this.dialog.open(AddMealDialogComponent, {
      data: {},
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.foodService
          .mealAdd$({
            name: result.name,
            calories: result.calories,
            proteins: result.proteins,
            fats: result.fats,
            carbohydrates: result.carbohydrates,
            isPublic: true,
          })
          .pipe(finalize(() => this.loadData()))
          .subscribe((x) => console.log(x));
      }
    });
  }

  addEntry(mealId: number) {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      data: {
        meals$: this.foodService.meals$,
        meal: {},
        entry: {
          mealId: mealId,
        },
      },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result: EntryDialogData) => {
      if (result) {
        this.foodService
          .entryAdd$({
            mealId: result.entry.mealId,
            date: moment(result.entry.date).format('yyyy-MM-DD').toString(),
            type: result.entry.type,
            amount: result.entry.amount,
            username: this.username,
          })
          .subscribe((x) => console.log(x));
      }
    });
  }
}
