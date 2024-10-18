import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsListContainerComponent } from './tags-list-container.component';

describe('TagsListContainerComponent', () => {
  let component: TagsListContainerComponent;
  let fixture: ComponentFixture<TagsListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
