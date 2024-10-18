import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReplyComponent } from './send-reply.component';

describe('SendReplyComponent', () => {
  let component: SendReplyComponent;
  let fixture: ComponentFixture<SendReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendReplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
