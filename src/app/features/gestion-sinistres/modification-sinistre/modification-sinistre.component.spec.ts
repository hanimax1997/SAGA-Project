import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationSinistreComponent } from './modification-sinistre.component';

describe('ModificationSinistreComponent', () => {
  let component: ModificationSinistreComponent;
  let fixture: ComponentFixture<ModificationSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationSinistreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
