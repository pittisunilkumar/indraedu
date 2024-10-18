import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyCouponsListContainerComponent } from './faculty-coupons-list-container.component';

describe('FacultyCouponsListContainerComponent', () => {
  let component: FacultyCouponsListContainerComponent;
  let fixture: ComponentFixture<FacultyCouponsListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyCouponsListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyCouponsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
