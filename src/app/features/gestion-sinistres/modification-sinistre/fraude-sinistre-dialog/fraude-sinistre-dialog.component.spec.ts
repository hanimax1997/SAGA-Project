import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudeSinistreDialogComponent } from './fraude-sinistre-dialog.component';

describe('FraudeSinistreDialogComponent', () => {
  let component: FraudeSinistreDialogComponent;
  let fixture: ComponentFixture<FraudeSinistreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FraudeSinistreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudeSinistreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
