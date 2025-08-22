import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultReductionComponent } from './consult-reduction.component';

describe('ConsultReductionComponent', () => {
  let component: ConsultReductionComponent;
  let fixture: ComponentFixture<ConsultReductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultReductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultReductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
