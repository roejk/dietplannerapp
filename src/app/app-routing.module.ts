import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { UserComponent } from './component/user/user.component';
import { RecipesComponent } from './component/food/recipes/recipes.component';
import { MealPlanComponent } from './component/food/meal-plan/meal-plan.component';
import { MealsComponent } from './component/food/meals/meals.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'users',
    component: UserComponent,
  },
  {
    path: 'meals',
    component: MealsComponent,
  },
  {
    path: 'meal-plan',
    component: MealPlanComponent,
  },
  {
    path: 'recipes',
    component: RecipesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
