import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationReductionComponent } from './creation-reduction.component';

describe('CreationReductionComponent', () => {
  let component: CreationReductionComponent;
  let fixture: ComponentFixture<CreationReductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationReductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationReductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
