import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgContainerComponent } from './org-container.component';

describe('OrgContainerComponent', () => {
  let component: OrgContainerComponent;
  let fixture: ComponentFixture<OrgContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
