import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssistanceDialogComponent } from './edit-assistance-dialog.component';

describe('EditAssistanceDialogComponent', () => {
  let component: EditAssistanceDialogComponent;
  let fixture: ComponentFixture<EditAssistanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssistanceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssistanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
