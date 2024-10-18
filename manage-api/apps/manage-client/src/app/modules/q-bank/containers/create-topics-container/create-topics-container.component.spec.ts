import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTopicsContainerComponent } from './create-topics-container.component';

describe('CreateTopicsContainerComponent', () => {
  let component: CreateTopicsContainerComponent;
  let fixture: ComponentFixture<CreateTopicsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTopicsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTopicsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
