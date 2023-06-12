import { Observable } from 'rxjs';

export enum MealEntryType {
  BREAKFAST = 'BREAKFAST',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  SUPPER = 'SUPPER',
}

export type Meal = {
  mealId?: number;
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  isPublic: boolean;
};

export type Entry = {
  mealEntryId?: number;
  username: string;
  meal?: Meal;
  mealId?: number;
  date: string;
  amount: number;
  type: MealEntryType;
};

export type Recipe = {
  recipeId?: number;
  name: string;
  ingredients: string;
  instructions: string;
  mealId: number;
};

export interface EntryDialogData {
  meals$: Observable<Meal[]>;
  entry: Entry;
}
