import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleContainerComponent } from './create-role-container.component';

describe('CreateRoleContainerComponent', () => {
  let component: CreateRoleContainerComponent;
  let fixture: ComponentFixture<CreateRoleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoleContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
