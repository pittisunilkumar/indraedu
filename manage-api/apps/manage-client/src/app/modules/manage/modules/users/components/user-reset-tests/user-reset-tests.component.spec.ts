import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResetTestsComponent } from './user-reset-tests.component';

describe('UserResetTestsComponent', () => {
  let component: UserResetTestsComponent;
  let fixture: ComponentFixture<UserResetTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserResetTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResetTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
