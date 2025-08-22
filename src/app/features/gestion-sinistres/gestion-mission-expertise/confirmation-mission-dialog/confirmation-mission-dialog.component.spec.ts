import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMissionDialogComponent } from './confirmation-mission-dialog.component';

describe('ConfirmationMissionDialogComponent', () => {
  let component: ConfirmationMissionDialogComponent;
  let fixture: ComponentFixture<ConfirmationMissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationMissionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationMissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
