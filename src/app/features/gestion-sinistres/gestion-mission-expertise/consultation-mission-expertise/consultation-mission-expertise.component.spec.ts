import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationMissionExpertiseComponent } from './consultation-mission-expertise.component';

describe('ConsultationMissionExpertiseComponent', () => {
  let component: ConsultationMissionExpertiseComponent;
  let fixture: ComponentFixture<ConsultationMissionExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationMissionExpertiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationMissionExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
