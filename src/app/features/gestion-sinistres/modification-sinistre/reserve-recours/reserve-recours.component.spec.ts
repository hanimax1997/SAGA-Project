import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveRecoursComponent } from './reserve-recours.component';

describe('ReserveRecoursComponent', () => {
  let component: ReserveRecoursComponent;
  let fixture: ComponentFixture<ReserveRecoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveRecoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveRecoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
