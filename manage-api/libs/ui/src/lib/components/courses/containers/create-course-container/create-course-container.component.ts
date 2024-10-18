import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseInterface, ResponseInterface } from '@application/api-interfaces';
import { CourseRepositoryService, SyllabusRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';


@Component({
  selector: 'application-create-course-container',
  templateUrl: './create-course-container.component.html',
  styleUrls: ['./create-course-container.component.less'],
})
export class CreateCourseContainerComponent implements OnInit {

  // syllabus$ = this.syllabus.getAllSyllabus();
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  course$: Observable<ResponseInterface<CourseInterface>>;

  fileName: any;
  file: File | any = null;

  constructor(
    private courseRepo: CourseRepositoryService,
    private syllabus: SyllabusRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    if (this.mode === 'edit') {
      this.course$ = this.getCourseByUuid$();
    }

  }

  getCourseByUuid$() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.courseRepo.getCourseByUuid(params.get('uuid'));
      })
    );

  }

  submit(course: CourseInterface) {

    if (this.mode === 'add') {
      this.courseRepo.createCourse(course).subscribe(
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
      this.courseRepo.editCourseByUuid(course).subscribe(
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
  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }
  async onSubjectubmit() {
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      var binaryData = e.target.result;
      var base64String = window.btoa(binaryData);
      const wb = XLSX.read(base64String, { type: 'base64' });
      const newFile = XLSX.write(wb, { bookType: 'csv', type: 'binary' });
      var col = newFile.toString().split('\n')
      col.shift()
      col.map((e, i) => {
        if (e.split(",").length > 1) {
          col[i] = e.split(',')
        }
      })
      if ((col[col.length - 1].length < 2)) {
        col.pop()
      }
      await col.map((e, i) => {
        let data = {
          uuid: uuid.v4(),
          title: e[0],
          imgUrl: e[1] ? e[1] : '',
          order: parseInt(e[2]),
          syllabus: e[3].split("#"),
          createdOn: new Date(),
          flags: {
            active: true,
            paid: true,
            qBank: true,
            testSeries: true,
            videos: true,
          },
          organizations: [],
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
        }
        console.log('data', data);
        this.courseRepo.createCourse(data).subscribe(data => {
          if (data) {
            console.log(data);
          }
        })
      })
      // console.log(sArray);



      // data.map((userData, i) => {
      //   this.courseRepo.createCourse(userData).subscribe(data => {
      //     if (data) {
      //       console.log(data);
      //     }
      //   })
      // })


    };
    reader.readAsBinaryString(this.file);
    // this.router.navigateByUrl('/manage/users/list');
  }
}
