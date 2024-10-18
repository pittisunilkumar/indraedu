import { Component, OnInit } from '@angular/core';
import { CareerInterface } from '@application/api-interfaces';
import { CareersRepositoryService } from '@application/ui';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'application-career-list-container',
  templateUrl: './career-list-container.component.html',
  styleUrls: ['./career-list-container.component.less']
})
export class CareerListContainerComponent implements OnInit {

  careers$ = this.careersRepo.getAllCareers();
  sub = new Subscription();

  constructor(
    private careersRepo: CareersRepositoryService,
  ) { }

  createEnable:string
  ngOnInit(): void {
    this.createEnable = localStorage.getItem('isAccess');
  }

  delete(career: CareerInterface) {
    return this.careersRepo
      .deleteCareerByUuid(career.uuid)
      .pipe(take(1))
      .subscribe(
        (res) => {
          console.log({ res });
          this.careers$ = this.careersRepo.getAllCareers();
        },
        (err) => {
          console.error({ err });
        }
      );
  }

}
