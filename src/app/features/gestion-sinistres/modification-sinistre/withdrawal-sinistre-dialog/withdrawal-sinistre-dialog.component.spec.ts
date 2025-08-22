import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalSinistreDialogComponent } from './withdrawal-sinistre-dialog.component';

describe('WithdrawalSinistreDialogComponent', () => {
  let component: WithdrawalSinistreDialogComponent;
  let fixture: ComponentFixture<WithdrawalSinistreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawalSinistreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawalSinistreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
