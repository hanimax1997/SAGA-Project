import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnteteGestionComponent } from './entete-gestion.component';

describe('EnteteGestionComponent', () => {
  let component: EnteteGestionComponent;
  let fixture: ComponentFixture<EnteteGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnteteGestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnteteGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
