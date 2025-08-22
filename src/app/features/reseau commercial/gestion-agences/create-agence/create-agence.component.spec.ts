import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgenceComponent } from './create-agence.component';

describe('CreateAgenceComponent', () => {
  let component: CreateAgenceComponent;
  let fixture: ComponentFixture<CreateAgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
