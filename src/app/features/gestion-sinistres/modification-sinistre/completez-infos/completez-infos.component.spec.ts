import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletezInfosComponent } from './completez-infos.component';

describe('CompletezInfosComponent', () => {
  let component: CompletezInfosComponent;
  let fixture: ComponentFixture<CompletezInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletezInfosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletezInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
