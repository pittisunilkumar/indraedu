import {ComponentFixture, TestBed } from '@angular/core/testing';
import { BankContainerComponent } from './bank-container.component';

describe('BankContainerComponent', () => {
  let component: BankContainerComponent;
  let fixture: ComponentFixture<BankContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BankContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
