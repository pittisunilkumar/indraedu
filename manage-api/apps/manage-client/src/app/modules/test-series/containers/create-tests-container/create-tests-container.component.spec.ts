import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestsContainerComponent } from './create-tests-container.component';

describe('CreateTestsContainerComponent', () => {
  let component: CreateTestsContainerComponent;
  let fixture: ComponentFixture<CreateTestsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
