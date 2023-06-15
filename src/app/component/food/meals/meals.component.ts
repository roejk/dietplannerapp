import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EntryDialogData, Meal, Recipe } from '../food.types';
import { Observable, finalize } from 'rxjs';
import { FoodService } from 'src/app/service/food/food.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMealDialogComponent } from './add-meal-dialog/add-meal-dialog.component';
import { AddEntryDialogComponent } from '../meal-plan/add-entry-dialog/add-entry-dialog.component';
import { TokenDecoderService } from 'src/app/service/token-decoder/token-decoder.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AddRecipeDialogComponent } from '../recipes/add-recipe-dialog/add-recipe-dialog.component';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss'],
})
export class MealsComponent implements OnInit, AfterViewInit {
  private username = this.decoder.getUsernameFromToken();
  dataSource: MatTableDataSource<Meal> = new MatTableDataSource();
  displayedColumns: string[] = [
    'meal',
    'calories',
    'proteins',
    'fats',
    'carbohydrates',
    'add',
  ];
  recipes$: Observable<Recipe[]>;
  chosenMealId: number;

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
    this.foodService.meals$.subscribe((x) => (this.dataSource.data = x));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
          .subscribe();
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
          .subscribe();
      }
    });
  }

  getRecipesForMeal(mealId: number) {
    this.chosenMealId = mealId;
    this.recipes$ = this.foodService.recipesByMealId$(mealId);
  }

  addRecipe() {
    const dialogRef = this.dialog.open(AddRecipeDialogComponent, {
      data: { mealId: this.chosenMealId },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.foodService
        .recipeAdd$({
          mealId: result.mealId,
          name: result.name,
          ingredients: result.ingredients,
          instructions: result.instructions,
        })
        .pipe(finalize(() => this.loadData()))
        .subscribe();
    });
  }
}
