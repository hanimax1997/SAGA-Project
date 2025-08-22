import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDevisCommercialLineComponent } from './gestion-devis-commercial-line.component';

describe('GestionDevisCommercialLineComponent', () => {
  let component: GestionDevisCommercialLineComponent;
  let fixture: ComponentFixture<GestionDevisCommercialLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDevisCommercialLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDevisCommercialLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
