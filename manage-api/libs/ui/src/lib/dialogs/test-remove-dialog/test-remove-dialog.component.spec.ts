import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRemoveDialogComponent } from './test-remove-dialog.component';

describe('TestRemoveDialogComponent', () => {
  let component: TestRemoveDialogComponent;
  let fixture: ComponentFixture<TestRemoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestRemoveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
