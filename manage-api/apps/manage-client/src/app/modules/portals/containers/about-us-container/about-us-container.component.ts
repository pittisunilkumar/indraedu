import { Component, OnDestroy, OnInit } from '@angular/core';
import { AboutInterface } from '@application/api-interfaces';
import { PortalRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'application-about-us-container',
  templateUrl: './about-us-container.component.html',
  styleUrls: ['./about-us-container.component.less']
})
export class AboutUsContainerComponent implements OnInit, OnDestroy {

  aboutUsPage$ = this.portalRepo.getAboutUsPage();
  sub = new Subscription();
  errors: string[];

  constructor(
    private portalRepo: PortalRepositoryService,
  ) { }

  ngOnInit(): void {
  }

  submit(data: AboutInterface) {
    // createAboutUsPage
      this.portalRepo.updateAboutUsPage(data).pipe(take(1))
      .subscribe(
        (result) => {
          console.log({ result });
        },
        (err) => {
          this.errors = err.error.error;
        }
      );

  }

  ngOnDestroy() {

    this.sub.unsubscribe();

  }

}
