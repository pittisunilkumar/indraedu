import { Component, OnInit } from '@angular/core';
import { OrganizationInterface } from '@application/api-interfaces';
import { OrganizationRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'application-org-list-container',
  templateUrl: './org-list-container.component.html',
  styleUrls: ['./org-list-container.component.less'],
})
export class OrgListContainerComponent implements OnInit {
  public orgs$ = this.orgFinder.getAllOrganizations();
  public _sub: Subscription;

  constructor(private orgFinder: OrganizationRepositoryService) {}

  ngOnInit(): void {}

  delete(org: OrganizationInterface) {
    return this.orgFinder.removeOrganization(org).subscribe(
      (result) => {
        console.log(result);
        this.orgs$ = this.orgFinder.getAllOrganizations();
      },
      (error) => {
        console.log({ error });
      }
    );
  }
}
