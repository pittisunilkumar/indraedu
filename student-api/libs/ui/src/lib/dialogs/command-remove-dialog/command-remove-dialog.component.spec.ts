import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandRemoveDialogComponent } from './command-remove-dialog.component';

describe('CommandRemoveDialogComponent', () => {
  let component: CommandRemoveDialogComponent;
  let fixture: ComponentFixture<CommandRemoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandRemoveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandRemoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
