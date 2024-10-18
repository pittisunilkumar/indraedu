import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleListContainerComponent } from './role-list-container.component';

describe('RoleListContainerComponent', () => {
  let component: RoleListContainerComponent;
  let fixture: ComponentFixture<RoleListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
