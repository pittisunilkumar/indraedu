import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TagInterface,ResponseInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';
import {  TagsRepositoryService } from '@application/ui';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'application-create-tags-container',
  templateUrl: './create-tags-container.component.html',
  styleUrls: ['./create-tags-container.component.less']
})
export class CreateTagsContainerComponent implements OnInit {
  mode = this.route.snapshot.data['mode'];
  errors: string[];
  tag$: Observable<ResponseInterface<TagInterface>>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tagsRepo: TagsRepositoryService,
  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.tag$ = this.getTagByUuid$();
    }
    
  }
  getTagByUuid$() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        console.log(params.get('uuid'));
        return this.tagsRepo.getTagByUuid(params.get('uuid'));
      })
    );

  }

  submit(tag: TagInterface) {

    if(this.mode === 'add') {
      this.tagsRepo.addTag(tag).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );
    } else {

      this.tagsRepo.editTagByUuid(tag).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );

    }


  }

}
