import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommercialLineComponent } from './product-commercial-line.component';

describe('ProductCommercialLineComponent', () => {
  let component: ProductCommercialLineComponent;
  let fixture: ComponentFixture<ProductCommercialLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCommercialLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommercialLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
