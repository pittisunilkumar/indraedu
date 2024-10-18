import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusInfoComponent } from './syllabus-info.component';

describe('SyllabusInfoComponent', () => {
  let component: SyllabusInfoComponent;
  let fixture: ComponentFixture<SyllabusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllabusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
