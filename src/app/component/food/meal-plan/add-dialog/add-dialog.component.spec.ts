import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntryDialogComponent } from './add-dialog.component';

describe('AddDialogComponent', () => {
  let component: AddEntryDialogComponent;
  let fixture: ComponentFixture<AddEntryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEntryDialogComponent],
    });
    fixture = TestBed.createComponent(AddEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});