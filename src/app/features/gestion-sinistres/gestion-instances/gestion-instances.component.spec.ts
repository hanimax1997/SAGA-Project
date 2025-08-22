import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInstancesComponent } from './gestion-instances.component';

describe('GestionInstancesComponent', () => {
  let component: GestionInstancesComponent;
  let fixture: ComponentFixture<GestionInstancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionInstancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
