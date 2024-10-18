import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationInterface } from '@application/api-interfaces';
import { UserInterface } from '@application/api-interfaces';
import {
  CourseRepositoryService,
  CreateCourseComponent,
  OrganizationRepositoryService,
  UsersRepositoryService,
} from '@application/ui';
import * as _differenceBy from 'lodash.differenceby';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AssignUsersComponent } from '../../components';

@Component({
  selector: 'application-org-container',
  templateUrl: './org-container.component.html',
  styleUrls: ['./org-container.component.less'],
})
export class OrgContainerComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  org$: Observable<OrganizationInterface>;
  org: any;
  users: UserInterface[];
  public sub = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orgFinder: OrganizationRepositoryService,
    public dialog: MatDialog,
    private courseRepo: CourseRepositoryService,
    // public dialogRef: MatDialogRef<CreateCourseComponent>,
    private usersFinder: UsersRepositoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.org$ = this.getOrgByUuid();
    this.sub.add(this.bindOrg());
    this.sub.add(this.bindUsers());
  }

  ngAfterViewChecked() {
    // this.loadData();
  }

  getOrgByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.orgFinder.getOrganizationByUuid(params.get('orgUuid'));
      })
    );
  }

  bindOrg() {
    this.org$.subscribe((org) => (this.org = org));
  }

  bindUsers() {
    this.usersFinder.getAllUsers().subscribe((users) => (this.users = users?.response));
  }

  openCreateCourseDialog() {
    this.dialog.open(CreateCourseComponent, {
      data: {
        org: this.org,
      },
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.loadData();
    });
  }

  // openEditCourseDialog(course: CourseInterface) {
  //   this.dialog.open(CreateCourseComponent, {
  //     data: {
  //       org: this.org,
  //       course,
  //     },
  //   });

  //   this.dialog.afterAllClosed.subscribe(() => {
  //     this.loadData();
  //   });
  // }

  openAssignUserDialog() {
    this.dialog.open(AssignUsersComponent, {
      data: {
        org: this.org,
        users: _differenceBy(this.users, this.org.users, 'uuid'),
      },
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.loadData();
    });
  }

  // deleteCourse(course: CourseInterface) {
  //   return this.courseRepo
  //     .deleteCourseByUuid(this.org.uuid, course.uuid)
  //     .subscribe(
  //       (res) => {
  //         console.log('Delete Course: ', res);
  //         this.loadData();
  //       },
  //       (err) => {
  //         console.log('Delete Course Error: ', err);
  //       }
  //     );
  // }

  deleteUser(user: UserInterface) {
    this.usersFinder.removeUserFromOrganization(this.org, user).subscribe(
      (res) => {
        console.log('Delete User from org: ', res);
        this.loadData();
      },
      (err) => {
        console.log('Delete User from org Error: ', err);
      }
    );
    this.usersFinder.removeUserFromOrganization(this.org, user).subscribe(
      (res) => {
        console.log('Delete Org from User: ', res);
        this.loadData();
      },
      (err) => {
        console.log('Delete Org from User Error: ', err);
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
