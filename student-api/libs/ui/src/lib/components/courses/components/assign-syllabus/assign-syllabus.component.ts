import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  CourseInterface,
  OrganizationInterface,
  SyllabusInterface,
  UserInterface,
} from '@application/api-interfaces';
import {
  CourseRepositoryService,
} from '../../../../repositories/course-repository.service';

@Component({
  selector: 'application-assign-syllabus',
  templateUrl: './assign-syllabus.component.html',
  styleUrls: ['./assign-syllabus.component.less'],
})
export class AssignSyllabusComponent implements OnInit {
  displayedColumns: string[] = ['select', 'title', 'type'];
  dataSource: MatTableDataSource<SyllabusInterface>;
  selection = new SelectionModel<SyllabusInterface>(true, []);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      course: CourseInterface;
      syllabus: SyllabusInterface[];
    },
    private dialogRef: MatDialogRef<AssignSyllabusComponent>,
    private courseRepo: CourseRepositoryService
  ) {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SyllabusInterface) {
    if (!row) {
    }

    return this.selection.isSelected(row);
  }

  submit() {
    this.courseRepo
      .assignBulkSyllabus(this.data.course, this.selection.selected)
      .subscribe(
        (res) => {
          console.log({ res });
          this.dialogRef.close();
        },
        (err) => {
          console.log({ err });
        }
      );
  }

  ngOnInit(): void {
    if (this.data?.syllabus) {
      this.dataSource = new MatTableDataSource<SyllabusInterface>(
        this.data?.syllabus
      );
    }
  }
}
