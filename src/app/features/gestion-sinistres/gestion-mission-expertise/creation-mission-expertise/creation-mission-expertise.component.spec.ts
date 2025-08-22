import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationMissionExpertiseComponent } from './creation-mission-expertise.component';

describe('CreationMissionExpertiseComponent', () => {
  let component: CreationMissionExpertiseComponent;
  let fixture: ComponentFixture<CreationMissionExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationMissionExpertiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationMissionExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
