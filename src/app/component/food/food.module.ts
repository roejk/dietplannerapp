import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { AddEntryDialogComponent } from './meal-plan/add-entry-dialog/add-entry-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MealsComponent } from './meals/meals.component';
import { AddMealDialogComponent } from './meals/add-meal-dialog/add-meal-dialog.component';
import { RecipesComponent } from './recipes/recipes.component';
import { AddRecipeDialogComponent } from './recipes/add-recipe-dialog/add-recipe-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    MealPlanComponent,
    AddEntryDialogComponent,
    MealsComponent,
    AddMealDialogComponent,
    RecipesComponent,
    AddRecipeDialogComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatRadioModule,
    MatSortModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatMenuModule,
    MatPaginatorModule,
    NgxMatSelectSearchModule,
  ],
})
export class FoodModule {}
