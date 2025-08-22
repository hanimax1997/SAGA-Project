import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivationReductionDialogComponent } from './desactivation-reduction-dialog.component';

describe('DesactivationReductionDialogComponent', () => {
  let component: DesactivationReductionDialogComponent;
  let fixture: ComponentFixture<DesactivationReductionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesactivationReductionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivationReductionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
