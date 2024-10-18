import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannersListContainerComponent } from './banners-list-container.component';

describe('BannersListContainerComponent', () => {
  let component: BannersListContainerComponent;
  let fixture: ComponentFixture<BannersListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BannersListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
