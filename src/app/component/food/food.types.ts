export enum MealEntryType {
  BREAKFAST = 'BREAKFAST',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  SUPPER = 'SUPPER',
}

export type Meal = {
  mealId: number;
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  isPublic: boolean;
};

export type Entry = {
  mealEntryId: number;
  username: string;
  mealId: number;
  date: string;
  amount: number;
  type: MealEntryType;
};
