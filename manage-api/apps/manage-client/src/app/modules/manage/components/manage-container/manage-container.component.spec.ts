import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContainerComponent } from './manage-container.component';

describe('ManageContainerComponent', () => {
  let component: ManageContainerComponent;
  let fixture: ComponentFixture<ManageContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
