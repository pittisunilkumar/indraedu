import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeContainerComponent } from './add-employee-container.component';

describe('AddEmployeeContainerComponent', () => {
  let component: AddEmployeeContainerComponent;
  let fixture: ComponentFixture<AddEmployeeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmployeeContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
