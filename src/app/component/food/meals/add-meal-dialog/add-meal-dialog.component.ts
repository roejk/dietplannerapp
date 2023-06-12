import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Meal } from '../../food.types';

@Component({
  selector: 'app-add-meal-dialog',
  templateUrl: './add-meal-dialog.component.html',
  styleUrls: ['./add-meal-dialog.component.scss'],
})
export class AddMealDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddMealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Meal
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
