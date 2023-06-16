import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Entry, EntryDialogData, Meal } from '../../food.types';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, filter, map, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-entry-dialog.component.html',
  styleUrls: ['./add-entry-dialog.component.scss'],
})
export class AddEntryDialogComponent implements OnInit, OnDestroy {
  public mealsCtrl: FormControl<Meal> = new FormControl<Meal>(null);
  public filterCtrl: FormControl<string> = new FormControl<string>('');
  public filteredMeals: ReplaySubject<Meal[]> = new ReplaySubject<Meal[]>(1);
  private meals: Meal[];

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<AddEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntryDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.meals$) {
      this.data.meals$.subscribe({
        next: (meals) => {
          this.meals = meals;
          this.mealsCtrl.setValue(this.meals[3]);
          this.filteredMeals.next(this.meals.slice());
        },
      });
    } else if (this.data.mealsPage$) {
      this.data.mealsPage$.subscribe({
        next: (meals) => {
          this.meals = meals.content;
          this.mealsCtrl.setValue(this.meals[3]);
          this.filteredMeals.next(this.meals.slice());
        },
      });
    }

    this.filterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMeals();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterMeals() {
    if (!this.data.meals$ && !this.data.mealsPage$) {
      return;
    }

    let search = this.filterCtrl.value;
    if (!search) {
      this.filteredMeals.next(this.meals.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredMeals.next(
      this.meals.filter((meal) => meal.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
