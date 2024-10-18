import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectListContainerComponent } from './subject-list-container.component';

describe('SubjectListContainerComponent', () => {
  let component: SubjectListContainerComponent;
  let fixture: ComponentFixture<SubjectListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
