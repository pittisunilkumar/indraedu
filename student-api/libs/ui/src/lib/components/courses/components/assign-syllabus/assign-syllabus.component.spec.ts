import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSyllabusComponent } from './assign-syllabus.component';

describe('AssignUsersComponent', () => {
  let component: AssignSyllabusComponent;
  let fixture: ComponentFixture<AssignSyllabusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignSyllabusComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
