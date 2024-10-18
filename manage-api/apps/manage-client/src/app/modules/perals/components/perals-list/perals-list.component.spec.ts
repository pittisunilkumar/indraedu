import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeralsListComponent } from './perals-list.component';

describe('PeralsListComponent', () => {
  let component: PeralsListComponent;
  let fixture: ComponentFixture<PeralsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeralsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeralsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
