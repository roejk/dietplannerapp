import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Recipe, RecipeDialogData } from '../../food.types';

@Component({
  selector: 'app-add-recipe-dialog',
  templateUrl: './add-recipe-dialog.component.html',
  styleUrls: ['./add-recipe-dialog.component.scss'],
})
export class AddRecipeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
