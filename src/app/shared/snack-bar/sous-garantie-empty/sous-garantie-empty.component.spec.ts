import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousGarantieEmptyComponent } from './sous-garantie-empty.component';

describe('SousGarantieEmptyComponent', () => {
  let component: SousGarantieEmptyComponent;
  let fixture: ComponentFixture<SousGarantieEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousGarantieEmptyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousGarantieEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
