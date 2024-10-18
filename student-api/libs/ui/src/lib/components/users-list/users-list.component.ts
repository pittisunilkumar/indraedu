import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserInterface } from '@application/api-interfaces';
import { HelperService } from '../../helpers/helper-service';

@Component({
  selector: 'application-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'sno',
    'name',
    'type',
    'mobile',
    'email',
    'subscription',
    'createdOn',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<UserInterface>;

  @Input() users: UserInterface[];
  @Output() delete = new EventEmitter<UserInterface>();
  @Output() resetPassword = new EventEmitter<UserInterface>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public helper: HelperService,
    private router: Router,
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // Assign the data to the data source for the table to render
    if (changes?.users?.currentValue) {
      // const users = changes?.users?.currentValue
      //   .filter(user => user.mobile !== 9108391276)
      this.dataSource = new MatTableDataSource(changes?.users?.currentValue);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  edit(user: UserInterface) {

    return this.router.navigateByUrl(`/manage/users/${user.uuid}/edit`);

  }

  goToSubscriptions(user) {
    window.sessionStorage.setItem('userName',user.name)
    window.sessionStorage.setItem('userId',user._id);
    window.sessionStorage.setItem('userUuid',user.uuid);
    return this.router.navigateByUrl(`/manage/users/${user.uuid}/packages`);

  }

  userAccess() {

    const type = localStorage.getItem('currentUserType');
    return type === 'ADMIN' || type === 'SUPER';

  }

}
