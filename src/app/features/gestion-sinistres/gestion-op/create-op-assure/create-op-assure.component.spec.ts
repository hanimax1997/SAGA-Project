import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpAssureComponent } from './create-op-assure.component';

describe('CreateOpAssureComponent', () => {
  let component: CreateOpAssureComponent;
  let fixture: ComponentFixture<CreateOpAssureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOpAssureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOpAssureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
