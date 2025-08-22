import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReserveDialogComponent } from './edit-reserve-dialog.component';

describe('EditReserveDialogComponent', () => {
  let component: EditReserveDialogComponent;
  let fixture: ComponentFixture<EditReserveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReserveDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReserveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
