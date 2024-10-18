import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleValueComponent } from './create-role-value.component';

describe('CreateRoleValueComponent', () => {
  let component: CreateRoleValueComponent;
  let fixture: ComponentFixture<CreateRoleValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRoleValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoleValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
