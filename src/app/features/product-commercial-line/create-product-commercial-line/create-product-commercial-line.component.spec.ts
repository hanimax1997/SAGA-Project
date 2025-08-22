import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductCommercialLineComponent } from './create-product-commercial-line.component';

describe('CreateProductCommercialLineComponent', () => {
  let component: CreateProductCommercialLineComponent;
  let fixture: ComponentFixture<CreateProductCommercialLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductCommercialLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductCommercialLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
