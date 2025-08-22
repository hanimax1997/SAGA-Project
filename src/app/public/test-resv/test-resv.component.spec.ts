import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResvComponent } from './test-resv.component';

describe('TestResvComponent', () => {
  let component: TestResvComponent;
  let fixture: ComponentFixture<TestResvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestResvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestResvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
