import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationRepositoryService } from '@application/ui';
import { take } from 'rxjs/operators';
@Component({
  selector: 'application-create-org-container',
  templateUrl: './create-org-container.component.html',
  styleUrls: ['./create-org-container.component.less'],
})
export class CreateOrgContainerComponent implements OnInit {

  errors: string[];

  constructor(
    private orgFinder: OrganizationRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  submit(event) {
    
    this.orgFinder
      .addOrganization(event)
      .pipe(take(1))
      .subscribe(
        (result) => {
          console.log({ result });
          this.router.navigate(['../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          this.errors = err.error.error;
        }
      );
  }
}
