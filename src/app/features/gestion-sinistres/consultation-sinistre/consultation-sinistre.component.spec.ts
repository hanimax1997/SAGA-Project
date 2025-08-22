import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationSinistreComponent } from './consultation-sinistre.component';

describe('ConsultationSinistreComponent', () => {
  let component: ConsultationSinistreComponent;
  let fixture: ComponentFixture<ConsultationSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationSinistreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultationSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
