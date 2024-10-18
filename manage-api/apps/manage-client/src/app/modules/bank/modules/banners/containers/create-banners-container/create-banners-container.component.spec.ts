import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBannersContainerComponent } from './create-banners-container.component';

describe('CreateBannersContainerComponent', () => {
  let component: CreateBannersContainerComponent;
  let fixture: ComponentFixture<CreateBannersContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBannersContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBannersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
