import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBannersComponent } from './create-banners.component';

describe('CreateBannersComponent', () => {
  let component: CreateBannersComponent;
  let fixture: ComponentFixture<CreateBannersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBannersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
