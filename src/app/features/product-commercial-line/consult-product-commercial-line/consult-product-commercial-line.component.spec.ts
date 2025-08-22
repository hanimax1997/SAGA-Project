import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultProductCommercialLineComponent } from './consult-product-commercial-line.component';

describe('ConsultProductCommercialLineComponent', () => {
  let component: ConsultProductCommercialLineComponent;
  let fixture: ComponentFixture<ConsultProductCommercialLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultProductCommercialLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultProductCommercialLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
