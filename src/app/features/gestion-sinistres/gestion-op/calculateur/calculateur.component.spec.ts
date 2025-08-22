import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateurComponent } from './calculateur.component';

describe('CalculateurComponent', () => {
  let component: CalculateurComponent;
  let fixture: ComponentFixture<CalculateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
