import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyListContainerComponent } from './faculty-list-container.component';

describe('FacultyListContainerComponent', () => {
  let component: FacultyListContainerComponent;
  let fixture: ComponentFixture<FacultyListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
