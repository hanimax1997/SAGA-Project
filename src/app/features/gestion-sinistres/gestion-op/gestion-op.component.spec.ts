import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOpComponent } from './gestion-op.component';

describe('GestionOpComponent', () => {
  let component: GestionOpComponent;
  let fixture: ComponentFixture<GestionOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionOpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
