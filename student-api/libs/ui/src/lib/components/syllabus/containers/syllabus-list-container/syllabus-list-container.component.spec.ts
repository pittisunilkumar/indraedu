import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusListContainerComponent } from './syllabus-list-container.component';

describe('SyllabusListContainerComponent', () => {
  let component: SyllabusListContainerComponent;
  let fixture: ComponentFixture<SyllabusListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SyllabusListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllabusListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
