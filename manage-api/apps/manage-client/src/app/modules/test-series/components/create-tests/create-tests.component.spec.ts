import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestsComponent } from './create-tests.component';

describe('CreateTestsComponent', () => {
  let component: CreateTestsComponent;
  let fixture: ComponentFixture<CreateTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
