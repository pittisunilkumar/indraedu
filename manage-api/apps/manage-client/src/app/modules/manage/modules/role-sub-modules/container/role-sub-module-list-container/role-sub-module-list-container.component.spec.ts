import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSubModuleListContainerComponent } from './role-sub-module-list-container.component';

describe('RoleSubModuleListContainerComponent', () => {
  let component: RoleSubModuleListContainerComponent;
  let fixture: ComponentFixture<RoleSubModuleListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleSubModuleListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSubModuleListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
