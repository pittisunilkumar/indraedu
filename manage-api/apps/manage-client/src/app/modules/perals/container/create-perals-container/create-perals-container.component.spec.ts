import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePeralsContainerComponent } from './create-perals-container.component';

describe('CreatePeralsContainerComponent', () => {
  let component: CreatePeralsContainerComponent;
  let fixture: ComponentFixture<CreatePeralsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePeralsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePeralsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
