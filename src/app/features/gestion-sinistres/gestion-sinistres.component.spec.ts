import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSinistresComponent } from './gestion-sinistres.component';

describe('GestionSinistresComponent', () => {
  let component: GestionSinistresComponent;
  let fixture: ComponentFixture<GestionSinistresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionSinistresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSinistresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
