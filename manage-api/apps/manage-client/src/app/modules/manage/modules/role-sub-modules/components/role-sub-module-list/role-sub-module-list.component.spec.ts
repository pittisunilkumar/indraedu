import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSubModuleListComponent } from './role-sub-module-list.component';

describe('RoleSubModuleListComponent', () => {
  let component: RoleSubModuleListComponent;
  let fixture: ComponentFixture<RoleSubModuleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleSubModuleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSubModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
