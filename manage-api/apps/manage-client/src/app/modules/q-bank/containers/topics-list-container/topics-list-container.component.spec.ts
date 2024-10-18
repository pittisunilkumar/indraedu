import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsListContainerComponent } from './topics-list-container.component';

describe('TopicsListContainerComponent', () => {
  let component: TopicsListContainerComponent;
  let fixture: ComponentFixture<TopicsListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
