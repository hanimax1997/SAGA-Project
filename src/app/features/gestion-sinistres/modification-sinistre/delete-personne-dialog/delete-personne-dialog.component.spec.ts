import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePersonneDialogComponent } from './delete-personne-dialog.component';

describe('DeletePersonneDialogComponent', () => {
  let component: DeletePersonneDialogComponent;
  let fixture: ComponentFixture<DeletePersonneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePersonneDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePersonneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
