import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleValueListComponent } from './role-value-list.component';

describe('RoleValueListComponent', () => {
  let component: RoleValueListComponent;
  let fixture: ComponentFixture<RoleValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleValueListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
