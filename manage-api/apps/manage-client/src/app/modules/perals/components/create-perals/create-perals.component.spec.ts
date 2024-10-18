import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePeralsComponent } from './create-perals.component';

describe('CreatePeralsComponent', () => {
  let component: CreatePeralsComponent;
  let fixture: ComponentFixture<CreatePeralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePeralsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePeralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
