import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTitleComponent } from './application-title.component';

describe('ApplicationTitleComponent', () => {
  let component: ApplicationTitleComponent;
  let fixture: ComponentFixture<ApplicationTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
