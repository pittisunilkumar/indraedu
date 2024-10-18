import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleSubModuleContainerComponent } from './create-role-sub-module-container.component';

describe('CreateRoleSubModuleContainerComponent', () => {
  let component: CreateRoleSubModuleContainerComponent;
  let fixture: ComponentFixture<CreateRoleSubModuleContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoleSubModuleContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleSubModuleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
