import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleValueContainerComponent } from './create-role-value-container.component';

describe('CreateRoleValueContainerComponent', () => {
  let component: CreateRoleValueContainerComponent;
  let fixture: ComponentFixture<CreateRoleValueContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoleValueContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleValueContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
