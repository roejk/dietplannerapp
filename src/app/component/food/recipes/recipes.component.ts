import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
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
  dataSource: MatTableDataSource<Recipe> = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'ingredients', 'instructions', 'add'];

  constructor(private foodService: FoodService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
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
