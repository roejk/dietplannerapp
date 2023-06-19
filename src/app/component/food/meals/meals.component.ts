import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EntryDialogData, Meal, Recipe } from '../food.types';
import { Observable, finalize, of } from 'rxjs';
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
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

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
    private decoder: TokenDecoderService,
    private authService: AuthenticationService
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
    // this.foodService.meals$.subscribe((x) => (this.dataSource.data = x));
    this.foodService
      .mealsPage$(0, 3000)
      .subscribe((x) => (this.dataSource.data = x.content));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  addMeal() {
    const dialogRef = this.dialog.open(AddMealDialogComponent, {
      data: {},
      width: '600px',
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
        // meals$: this.foodService.meals$,
        // mealsPage$: this.foodService.mealsPage$(0, 3000),
        meals$: of(this.dataSource.data),
        meal: {},
        entry: {
          mealId: mealId,
        },
      },
      width: '600px',
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
      data: {
        meals$: of(this.dataSource.data),
        recipe: { mealId: this.chosenMealId },
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.foodService
          .recipeAdd$({
            mealId: result.recipe.mealId,
            name: result.recipe.name,
            ingredients: result.recipe.ingredients,
            instructions: result.recipe.instructions,
          })
          .pipe(finalize(() => this.loadData()))
          .subscribe();
      }
    });
  }

  uploadMeals(fileInputEvent: any) {
    const file = fileInputEvent.target.files[0];
    if (!file) {
      return;
    }
    let formData = new FormData();
    formData.append('file', file, file.name);

    this.foodService.mealUpload$(formData).subscribe();
  }
}
