import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerInterface, ResponseInterface } from '@application/api-interfaces';
import { BannersRepositoryService, CourseRepositoryService } from '@application/ui';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-banners-container',
  templateUrl: './create-banners-container.component.html',
  styleUrls: ['./create-banners-container.component.less'],
})
export class CreateBannersContainerComponent implements OnInit {

  courses$ = this.courseRepo.getAllCourses();
  errors: string[];
  mode = this.route.snapshot.data['mode'];
  banner$: Observable<ResponseInterface<BannerInterface>>;

  fileName: any;
  file: File | any = null;
  bannersData:any;

  constructor(
    private courseRepo: CourseRepositoryService,
    private bannerRepo: BannersRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    if (this.mode === 'edit') {
      this.banner$ = this.getBannerByUuid$();
    }

  }

  getBannerByUuid$() {

    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.bannerRepo.getBannerByUuid(params.get('uuid'));
      })
    );

  }

  submit(banner: BannerInterface) {

    if(this.mode === 'add') {
      this.bannerRepo.addBanner(banner).subscribe(
        (res) => {
          console.log({ res });
          this.router.navigate(['../', 'list'], { relativeTo: this.route });
        },
        (err) => {
          this.errors = err.error.message;
        }
      );
    } else {

      this.bannerRepo.editBannerByUuid(banner).subscribe(
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
  FileSubmited() {
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = () => {
      this.bannersData = JSON.parse(fileReader.result);
      this.bannersData.map(res => {
        let cData = {
          uuid: uuid.v4(),
          title: '',
          imgUrl: res.image,
          link: '',
          youtubeLink:res.youtube_url?res.youtube_url:'',
          order:parseInt(res.order),
          createdOn: new Date(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          flags: {
            active:true,
          },
          courses:res.course_id,
          subscriptions: null
      }
        array.push(cData)
        
      })

      console.log(array);
      
      array.map(res => {
         this.bannerRepo.addBanner(res).subscribe(data => {
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
