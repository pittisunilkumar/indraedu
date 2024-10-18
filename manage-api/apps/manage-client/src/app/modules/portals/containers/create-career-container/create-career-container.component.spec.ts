import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCareerContainerComponent } from './create-career-container.component';

describe('CreateCareerContainerComponent', () => {
  let component: CreateCareerContainerComponent;
  let fixture: ComponentFixture<CreateCareerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCareerContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCareerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
