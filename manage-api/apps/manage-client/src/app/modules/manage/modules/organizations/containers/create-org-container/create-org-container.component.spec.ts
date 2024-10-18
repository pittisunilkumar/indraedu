import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrgContainerComponent } from './create-org-container.component';

describe('CreateOrgContainerComponent', () => {
  let component: CreateOrgContainerComponent;
  let fixture: ComponentFixture<CreateOrgContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrgContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrgContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
