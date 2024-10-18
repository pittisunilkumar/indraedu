import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAdvicePaymentsComponent } from './master-advice-payments.component';

describe('MasterAdvicePaymentsComponent', () => {
  let component: MasterAdvicePaymentsComponent;
  let fixture: ComponentFixture<MasterAdvicePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAdvicePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAdvicePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
