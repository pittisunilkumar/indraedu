import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsListContainerComponent } from './tests-list-container.component';

describe('TestsListContainerComponent', () => {
  let component: TestsListContainerComponent;
  let fixture: ComponentFixture<TestsListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
