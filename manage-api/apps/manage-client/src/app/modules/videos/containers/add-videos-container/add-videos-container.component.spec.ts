import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVideosContainerComponent } from './add-videos-container.component';

describe('AddVideosContainerComponent', () => {
  let component: AddVideosContainerComponent;
  let fixture: ComponentFixture<AddVideosContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVideosContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVideosContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
