import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInterface } from '@application/api-interfaces';

@Component({
  selector: 'application-manage-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUsersListComponent implements OnInit {

  @Input() users: UserInterface[];
  @Input() students: UserInterface[];
  @Output() delete = new EventEmitter<UserInterface>();
  @Output() resetPassword = new EventEmitter<UserInterface>();

  constructor() { }

  ngOnInit(): void {
    this.users = this.users;
    this.students = this.students;
    

  }

}
