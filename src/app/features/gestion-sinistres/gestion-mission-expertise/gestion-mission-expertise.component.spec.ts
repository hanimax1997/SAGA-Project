import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMissionExpertiseComponent } from './gestion-mission-expertise.component';

describe('GestionMissionExpertiseComponent', () => {
  let component: GestionMissionExpertiseComponent;
  let fixture: ComponentFixture<GestionMissionExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionMissionExpertiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMissionExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
