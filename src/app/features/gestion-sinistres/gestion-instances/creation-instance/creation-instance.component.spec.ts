import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationInstanceComponent } from './creation-instance.component';

describe('CreationInstanceComponent', () => {
  let component: CreationInstanceComponent;
  let fixture: ComponentFixture<CreationInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreationInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
