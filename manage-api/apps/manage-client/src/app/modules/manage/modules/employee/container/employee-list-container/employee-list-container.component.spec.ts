import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListContainerComponent } from './employee-list-container.component';

describe('EmployeeListContainerComponent', () => {
  let component: EmployeeListContainerComponent;
  let fixture: ComponentFixture<EmployeeListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
