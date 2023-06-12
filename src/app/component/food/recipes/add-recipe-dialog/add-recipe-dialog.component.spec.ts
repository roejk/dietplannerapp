import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeDialogComponent } from './add-recipe-dialog.component';

describe('AddRecipeDialogComponent', () => {
  let component: AddRecipeDialogComponent;
  let fixture: ComponentFixture<AddRecipeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRecipeDialogComponent]
    });
    fixture = TestBed.createComponent(AddRecipeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
