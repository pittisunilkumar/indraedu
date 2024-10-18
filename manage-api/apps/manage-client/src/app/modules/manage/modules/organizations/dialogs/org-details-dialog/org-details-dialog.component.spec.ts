import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgDetailsDialogComponent } from './org-details-dialog.component';

describe('OrgDetailsDialogComponent', () => {
  let component: OrgDetailsDialogComponent;
  let fixture: ComponentFixture<OrgDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
