import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntryDialogData } from '../../food.module';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css'],
})
export class AddEntryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntryDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
