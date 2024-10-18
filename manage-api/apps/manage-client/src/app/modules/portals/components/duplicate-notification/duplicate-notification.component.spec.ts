import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateNotificationComponent } from './duplicate-notification.component';

describe('DuplicateNotificationComponent', () => {
  let component: DuplicateNotificationComponent;
  let fixture: ComponentFixture<DuplicateNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
