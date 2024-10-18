import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyCouponsListComponent } from './faculty-coupons-list.component';

describe('FacultyCouponsListComponent', () => {
  let component: FacultyCouponsListComponent;
  let fixture: ComponentFixture<FacultyCouponsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyCouponsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyCouponsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
