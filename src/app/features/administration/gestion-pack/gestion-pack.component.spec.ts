import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPackComponent } from './gestion-pack.component';

describe('GestionPackComponent', () => {
  let component: GestionPackComponent;
  let fixture: ComponentFixture<GestionPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
