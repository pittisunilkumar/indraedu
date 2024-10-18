import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestCategoryInterface } from '@application/api-interfaces';
import { CourseRepositoryService, TestCategoriesRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';

@Component({
  selector: 'application-add-test-category-container',
  templateUrl: './add-test-category-container.component.html',
  styleUrls: ['./add-test-category-container.component.less']
})
export class AddTestCategoryContainerComponent implements OnInit {

  category$: Observable<TestCategoryInterface>;
  courses$ = this.courseRepo.getAllTestCourses();
  mode = this.route.snapshot.data['mode'];
  errors: string[] = [];

  fileName: any;
  file: File | any = null;
  categories:any;

  constructor(
    private categoryRepo: TestCategoriesRepositoryService,
    private courseRepo: CourseRepositoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.category$ = this.getTSCategoriesByUuid();
    }
  }

  getTSCategoriesByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.categoryRepo.getTSCategoriesByUuid(params.get('uuid'));
      })
    );
  }

  submit(category: TestCategoryInterface) {

    if (this.mode === 'add') {
      this.categoryRepo.addTSCategories(category).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );
    } else if (this.mode === 'edit') {
      this.categoryRepo.editTSCategoriesByUuid(category).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          console.log({ err });
        }
      );
    }

  }

  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  FileSubmited() {
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      this.categories = JSON.parse(fileReader.result);
      this.categories.map(res => {
        let cData = {
          uuid: uuid.v4(),
          categories: {
            uuid: uuid.v4(),
            title: res.title,
            order: parseInt(res.order),
            schedulePdf: res.image?res.image:'',
            tests: []
          },
          courses: res.course_id,
          scheduledDate:new Date(),
          createdOn: new Date().toISOString().toString(),
          flags: {
            active: true,
          },
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
        }
        array.push(cData)
        
      })

      console.log(array);
      
      array.map(res => {
        this.categoryRepo.addTSCategories(res).subscribe(data => {
          if (data) {
            console.log(data);
          }
        })
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }
    
  }

}
