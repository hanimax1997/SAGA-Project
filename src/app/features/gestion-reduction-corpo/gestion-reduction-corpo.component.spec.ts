import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReductionCorpoComponent } from './gestion-reduction-corpo.component';

describe('GestionReductionCorpoComponent', () => {
  let component: GestionReductionCorpoComponent;
  let fixture: ComponentFixture<GestionReductionCorpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionReductionCorpoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionReductionCorpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
