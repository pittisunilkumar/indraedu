import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleValueListContainerComponent } from './role-value-list-container.component';

describe('RoleValueListContainerComponent', () => {
  let component: RoleValueListContainerComponent;
  let fixture: ComponentFixture<RoleValueListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleValueListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleValueListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
