import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleSubModulesComponent } from './create-role-sub-modules.component';

describe('CreateRoleSubModulesComponent', () => {
  let component: CreateRoleSubModulesComponent;
  let fixture: ComponentFixture<CreateRoleSubModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoleSubModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleSubModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
