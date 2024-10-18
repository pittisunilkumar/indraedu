import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMoveVideosComponent } from './copy-move-videos.component';

describe('CopyMoveVideosComponent', () => {
  let component: CopyMoveVideosComponent;
  let fixture: ComponentFixture<CopyMoveVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyMoveVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyMoveVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
