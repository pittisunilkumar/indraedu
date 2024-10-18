import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, VideoSubjectInterface } from '@application/api-interfaces';
import { CourseRepositoryService, VideosRepositoryService } from '@application/ui';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-video-subjects-container',
  templateUrl: './create-subjects-container.component.html',
  styleUrls: ['./create-subjects-container.component.less']
})
export class CreateSubjectsContainerComponent implements OnInit, OnDestroy {

  mode = this.router.url.includes('edit') ? 'edit' : 'add';
  videoCourses$ = this.courseRepo.getAllVideoCourses();
  videoSubject$: Observable<ResponseInterface<VideoSubjectInterface>>
  errors: string[];
  _sub = new Subscription();

  fileName: any;
  file: File | any = null;
  qBankSubjects:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private courseRepo: CourseRepositoryService,
    private videosRepo: VideosRepositoryService,
  ) { }

  getVideosSubjectByUuid() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        console.log({ params });

        return this.videosRepo.getVideoSubjectsByUuid(params.get('uuid'));
      })
    );

  }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.videoSubject$ = this.getVideosSubjectByUuid();
      this.videoSubject$.subscribe(data=>{
        console.log(data);
      })
    }
  }

  submit(data: VideoSubjectInterface) {

    if(this.mode === 'add') {

      this.videosRepo.addVideoSubjects(data).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigateByUrl('/videos/subjects/list');
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      )

    } else {
      this.videosRepo.editVideoSubjectsByUuid(data).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigateByUrl('/videos/subjects/list');
        },
        (err) => {
          console.log({ err });
          this.errors = err.error.error;
        }
      );

    }
  }

  ngOnDestroy(): void {

    this._sub.unsubscribe();

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
      this.qBankSubjects = JSON.parse(fileReader.result);
      this.qBankSubjects.map(res => {
        let cData = {
        uuid: uuid.v4(),
        imgUrl: res.Image,
        courses: res.Course_id,
        syllabus: res.Subject_Id,
        chapters: JSON.parse(res.chapters),
        count: 0,
        order: Number(res.order),
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        flags: {
          active: true,
          suggested: true,
          paid:true
        }
      }
        array.push(cData)
        
      })

      console.log(array);
      
      array.map(res => {
        this.videosRepo.addVideoSubjects(res).subscribe(data => {
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
