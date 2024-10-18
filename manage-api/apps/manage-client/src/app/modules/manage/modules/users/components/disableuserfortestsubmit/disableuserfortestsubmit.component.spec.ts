import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableuserfortestsubmitComponent } from './disableuserfortestsubmit.component';

describe('DisableuserfortestsubmitComponent', () => {
  let component: DisableuserfortestsubmitComponent;
  let fixture: ComponentFixture<DisableuserfortestsubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisableuserfortestsubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisableuserfortestsubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
