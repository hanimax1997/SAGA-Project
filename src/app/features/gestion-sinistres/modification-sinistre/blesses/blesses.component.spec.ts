import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlessesComponent } from './blesses.component';

describe('BlessesComponent', () => {
  let component: BlessesComponent;
  let fixture: ComponentFixture<BlessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlessesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
