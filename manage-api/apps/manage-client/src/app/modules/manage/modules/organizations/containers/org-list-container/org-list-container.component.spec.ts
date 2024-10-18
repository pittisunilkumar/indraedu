import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgListContainerComponent } from './org-list-container.component';

describe('OrgListContainerComponent', () => {
  let component: OrgListContainerComponent;
  let fixture: ComponentFixture<OrgListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
