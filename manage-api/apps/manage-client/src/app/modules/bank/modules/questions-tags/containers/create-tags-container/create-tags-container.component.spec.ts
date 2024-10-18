import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTagsContainerComponent } from './create-tags-container.component';

describe('CreateTagsContainerComponent', () => {
  let component: CreateTagsContainerComponent;
  let fixture: ComponentFixture<CreateTagsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTagsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTagsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
