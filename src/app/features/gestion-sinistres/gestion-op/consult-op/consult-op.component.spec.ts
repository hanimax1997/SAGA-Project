import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultOpComponent } from './consult-op.component';

describe('ConsultOpComponent', () => {
  let component: ConsultOpComponent;
  let fixture: ComponentFixture<ConsultOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultOpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
