import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditRisqueComponent } from './dialog-edit-risque.component';

describe('DialogEditRisqueComponent', () => {
  let component: DialogEditRisqueComponent;
  let fixture: ComponentFixture<DialogEditRisqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditRisqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditRisqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
