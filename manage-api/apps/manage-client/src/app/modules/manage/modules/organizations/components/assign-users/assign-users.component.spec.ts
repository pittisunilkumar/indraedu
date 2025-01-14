import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUsersComponent } from './assign-users.component';

describe('AssignUsersComponent', () => {
  let component: AssignUsersComponent;
  let fixture: ComponentFixture<AssignUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
