import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementSinistreComponent } from './paiement-sinistre.component';

describe('PaiementSinistreComponent', () => {
  let component: PaiementSinistreComponent;
  let fixture: ComponentFixture<PaiementSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementSinistreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
