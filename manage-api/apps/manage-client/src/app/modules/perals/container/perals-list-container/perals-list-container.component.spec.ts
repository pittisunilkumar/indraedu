import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeralsListContainerComponent } from './perals-list-container.component';

describe('PeralsListContainerComponent', () => {
  let component: PeralsListContainerComponent;
  let fixture: ComponentFixture<PeralsListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeralsListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeralsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
