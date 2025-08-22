import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservePaiementComponent } from './reserve-paiement.component';

describe('ReservePaiementComponent', () => {
  let component: ReservePaiementComponent;
  let fixture: ComponentFixture<ReservePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservePaiementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
