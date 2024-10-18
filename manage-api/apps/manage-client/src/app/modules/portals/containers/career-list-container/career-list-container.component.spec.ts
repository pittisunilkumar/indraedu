import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerListContainerComponent } from './career-list-container.component';

describe('CareerListContainerComponent', () => {
  let component: CareerListContainerComponent;
  let fixture: ComponentFixture<CareerListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
