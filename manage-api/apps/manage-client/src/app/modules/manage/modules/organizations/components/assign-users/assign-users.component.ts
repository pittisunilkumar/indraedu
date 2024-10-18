import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  OrganizationInterface,
  UserInterface,
} from '@application/api-interfaces';
import { OrganizationRepositoryService, UsersRepositoryService } from '@application/ui';

@Component({
  selector: 'application-assign-users',
  templateUrl: './assign-users.component.html',
  styleUrls: ['./assign-users.component.less'],
})
export class AssignUsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'mobile'];
  dataSource: MatTableDataSource<UserInterface>; // = new MatTableDataSource<UserInterface>(this.data?.users);
  selection = new SelectionModel<UserInterface>(true, []);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      org: OrganizationInterface;
      users: UserInterface[];
    },
    private dialogRef: MatDialogRef<AssignUsersComponent>,
    private userRepo: UsersRepositoryService
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
  checkboxLabel(row?: UserInterface) {
    if (!row) {
    }

    return this.selection.isSelected(row);
  }

  submit() {
    this.userRepo
      .assignUsersToOrganization(this.data.org, this.selection.selected)
      .subscribe(
        (res) => {
          console.log({ res });
        },
        (err) => {
          console.log({ err });
        }
      );
    this.selection.selected.map((user) => {
      this.userRepo.assignOrganizationToUsers(user, this.data.org).subscribe(
        (res) => {
          console.log('Org assigned to user successfully');
          this.dialogRef.close();
        },
        (err) => {
          console.log({ err });
        }
      );
    });
  }

  ngOnInit(): void {
    if (this.data?.users) {
      this.dataSource = new MatTableDataSource<UserInterface>(this.data?.users);
    }
  }
}
