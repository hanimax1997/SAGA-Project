import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireSinistreComponent } from './gestionnaire-sinistre.component';

describe('GestionnaireSinistreComponent', () => {
  let component: GestionnaireSinistreComponent;
  let fixture: ComponentFixture<GestionnaireSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionnaireSinistreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionnaireSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
