import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAgenceDialogComponent } from './delete-agence-dialog.component';

describe('DeleteAgenceDialogComponent', () => {
  let component: DeleteAgenceDialogComponent;
  let fixture: ComponentFixture<DeleteAgenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAgenceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAgenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
