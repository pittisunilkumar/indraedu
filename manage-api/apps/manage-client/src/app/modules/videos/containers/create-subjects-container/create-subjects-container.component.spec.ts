import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubjectsContainerComponent } from './create-subjects-container.component';

describe('CreateSubjectsContainerComponent', () => {
  let component: CreateSubjectsContainerComponent;
  let fixture: ComponentFixture<CreateSubjectsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSubjectsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubjectsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
