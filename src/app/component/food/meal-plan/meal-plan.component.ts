import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { FoodService } from 'src/app/service/food/food.service';
import { Entry, EntryDialogData, MealEntryType } from '../food.types';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddEntryDialogComponent } from './add-entry-dialog/add-entry-dialog.component';
import * as moment from 'moment';
import { TokenDecoderService } from 'src/app/service/token-decoder/token-decoder.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.scss'],
})
export class MealPlanComponent implements OnInit {
  private username = this.decoder.getUsernameFromToken();
  readonly types = Object.values(MealEntryType);
  private data: Entry[] = [];
  splittedData = [];
  groupedData = [];
  displayedColumns: string[] = [
    'meal',
    'calories',
    'proteins',
    'fats',
    'carbohydrates',
    'amount',
    'add',
  ];
  readonly dates: string[] = [];
  selectedDate: string;
  totals = { calories: 0, proteins: 0, fats: 0, carbohydrates: 0, amount: 0 };

  constructor(
    private foodService: FoodService,
    public dialog: MatDialog,
    private decoder: TokenDecoderService
  ) {}

  ngOnInit(): void {
    for (let i = 7; i > 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i + 1);
      this.dates.push(formatDate(date, 'yyyy-MM-dd', 'en'));
    }
    this.selectedDate = this.dates.at(-1);
    this.loadData();
  }

  loadData() {
    this.foodService
      .entriesByDate$(this.username, this.selectedDate)
      .subscribe((x) => {
        this.data = x;
        this.splitEntriesByType();
        this.countTotals();
        this.groupEntriesByType();
      });
  }

  countTotals() {
    this.data.forEach((entry) => {
      this.totals.calories += (entry.meal.calories * entry.amount) / 100;
      this.totals.proteins += (entry.meal.proteins * entry.amount) / 100;
      this.totals.fats += (entry.meal.fats * entry.amount) / 100;
      this.totals.carbohydrates +=
        (entry.meal.carbohydrates * entry.amount) / 100;
      this.totals.amount += entry.amount;
    });
  }

  resetTotals() {
    this.totals.calories = 0;
    this.totals.proteins = 0;
    this.totals.fats = 0;
    this.totals.carbohydrates = 0;
    this.totals.amount = 0;
  }

  filterEntriesByDate(date: string) {
    this.resetTotals();
    this.selectedDate = moment(date).format('yyyy-MM-DD').toString();
    this.loadData();
  }

  splitEntriesByType() {
    for (let i = 0; i < this.types.length; i++) {
      this.splittedData.push({ type: this.types[i], isGroupBy: true });
      this.splittedData[i] = new MatTableDataSource<Entry>(
        this.data.filter((value) => value.type === this.types[i])
      );
    }
  }

  groupEntriesByType() {
    var x = [];
    for (let i = 0, j = 1; i < this.types.length; i++, j += 2) {
      x.push({ type: this.types[i], isGroupBy: true });
      x[j] = this.data.filter((value) => value.type === this.types[i]);
    }
    this.groupedData = x.flat(1);
  }

  isGroup(item): boolean {
    return item.isGroupBy;
  }

  addEntry(type: any) {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      data: {
        meals$: this.foodService.meals$,
        meal: {},
        entry: { date: this.selectedDate, type: type },
      },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result: EntryDialogData) => {
      if (result) {
        this.foodService
          .entryAdd$({
            mealId: result.entry.mealId,
            date: moment(result.entry.date).format('yyyy-MM-DD').toString(),
            type: result.entry.type,
            amount: result.entry.amount,
            username: this.username,
          })
          .pipe(finalize(() => this.filterEntriesByDate(this.selectedDate)))
          .subscribe((x) => console.log(x));
      }
    });
  }

  deleteEntry(id: number) {
    this.foodService
      .deleteEntry$(id)
      .pipe(finalize(() => this.filterEntriesByDate(this.selectedDate)))
      .subscribe((x) => console.log(x));
  }
}
