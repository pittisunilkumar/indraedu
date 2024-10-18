import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerInterface, ResponseInterface } from '@application/api-interfaces';
import { CareersRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'application-create-career-container',
  templateUrl: './create-career-container.component.html',
  styleUrls: ['./create-career-container.component.less']
})
export class CreateCareerContainerComponent implements OnInit {

  mode = this.route.snapshot.data['mode'];
  career$: Observable<ResponseInterface<CareerInterface>>;
  errors: string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private careersRepo: CareersRepositoryService,
  ) { }

  ngOnInit(): void {

    if (this.mode === 'edit') {
      this.career$ = this.getCareerByUuid();
    }

  }

  getCareerByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.careersRepo.getCareerByUuid(params.get('uuid'));
      })
    );
  }

  submit(payload: CareerInterface) {

    if (this.mode === 'add') {
      this.careersRepo
        .addCareer(payload)
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
    } else {
      this.careersRepo
        .editCareerByUuid(payload)
        .pipe(take(1))
        .subscribe((result) => {
          console.log({ result });
          this.router.navigateByUrl('/careers/list');
        });
    }
  }

}
