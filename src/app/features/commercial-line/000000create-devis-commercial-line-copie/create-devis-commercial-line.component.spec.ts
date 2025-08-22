import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDevisCommercialLineComponent } from './create-devis-commercial-line.component';

describe('CreateDevisCommercialLineComponent', () => {
  let component: CreateDevisCommercialLineComponent;
  let fixture: ComponentFixture<CreateDevisCommercialLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDevisCommercialLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDevisCommercialLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
