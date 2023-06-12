import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
  finalize,
} from 'rxjs';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { FoodService } from 'src/app/service/food/food.service';
import { Recipe } from '../food.types';
import { AddRecipeDialogComponent } from './add-recipe-dialog/add-recipe-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  // appState$: Observable<AppState<Recipe[]>>;
  // readonly DataState = DataState;
  // private dataSubject = new BehaviorSubject<Recipe[]>(null);
  dataSource: MatTableDataSource<Recipe> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'ingredients', 'instructions', 'add'];

  constructor(private foodService: FoodService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // this.appState$ = this.foodService.recipes$.pipe(
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

    this.foodService.recipes$.subscribe((x) => (this.dataSource.data = x));
  }

  addRecipe() {
    const dialogRef = this.dialog.open(AddRecipeDialogComponent, {
      data: {},
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
        .subscribe((x) => console.log(x));
    });
  }
}
