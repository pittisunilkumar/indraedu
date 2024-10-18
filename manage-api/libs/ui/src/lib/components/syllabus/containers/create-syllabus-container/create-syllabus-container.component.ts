import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, SyllabusInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CourseRepositoryService, SyllabusRepositoryService } from '../../../../repositories';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';

@Component({
  selector: 'application-create-syllabus-container',
  templateUrl: './create-syllabus-container.component.html',
  styleUrls: ['./create-syllabus-container.component.less'],
})
export class CreateSyllabusContainerComponent implements OnInit {

  // syllabus$ = this.syllabusRepository.getAllSyllabus();
  mode = this.route.snapshot.data['mode'];
  syllabusByUuid$: Observable<ResponseInterface<SyllabusInterface>>;
  courseList$ = this.courseRepo.getAllCourses();
  errors: string[];
  syllabusList;
  selectedFile: any;
  chapterData: any

  fileName: any;
  file: File | any = null;

  fileNameC: any;
  fileC: File | any = null;

  constructor(
    private syllabusRepository: SyllabusRepositoryService,
    private courseRepo: CourseRepositoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.syllabus$.subscribe(data => {
    //   console.log('data', data);
    //   this.syllabusList = data.response;
    //   console.log('this.syllabusList',this.syllabusList);
      
    //   this.syllabusRepository.syllabusList = data.response;
    // })

    if (this.mode === 'edit') {
      this.syllabusByUuid$ = this.getFacultyByUuid();
    }
  }

  getFacultyByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.syllabusRepository.getSyllabusByUuid(params.get('uuid'));
      })
    );
  }

  onSubmit(syllbaus: SyllabusInterface) {
    if (this.mode === 'add') {
      return this.syllabusRepository
        .addSyllabus(syllbaus)
        .pipe()
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/bank/syllabus/list');
          },
          (err) => {
            console.error(err);
            this.errors = err.error.error;
          }
        );
    } else {
      return this.syllabusRepository
        .editSyllabus(syllbaus)
        .pipe()
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/bank/syllabus/list');
          },
          (err) => {
            console.error(err);
            this.errors = err.error?.error;
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
      let data = await col.map(e => ({
        uuid: uuid.v4(),
        title: e[0],
        type: 'SUBJECT',
        shortcut: e[1],
        order: parseInt(e[2]),
        parents: [],
        children: [],
        imgUrlVideos: '',
        suggestedBanner: '',
        imgUrlQBank: '',
        flags: {
          active: true,
          editable: true,
          testSeries: true,
          videos: true,
          materials: true,
          flashCards: true,
          questionBank: true,
          mcq: true,
          suggested: true,
        },
        createdOn: new Date(),
        modifiedOn: null,
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }))

      data.map((userData, i) => {
        this.syllabusRepository.addSyllabus(userData).subscribe(data => {
          if (data) {
            console.log(data);
          }
        })
      })


    };
    reader.readAsBinaryString(this.file);
    // this.router.navigateByUrl('/manage/users/list');
  }

  onChapterFileSelected(event: any) {
    this.fileNameC = event.target.files[0].name;
    this.fileC = event.target.files[0];
  }
  FileChanged() {
    let array = []
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.fileC, "UTF-8");
    fileReader.onload = () => {
      this.chapterData = JSON.parse(fileReader.result);
      this.chapterData.map(res => {
        let cData = {
          uuid: uuid.v4(),
          title: res.title,
          type: 'CHAPTER',
          shortcut: res.shortcut,
          order: parseInt(res.order),
          parents: res.parent_id.split("#"),
          children: [],
          imgUrlVideos: res.video_image,
          suggestedBanner: res.banner_image,
          imgUrlQBank: res.qbank_image,
          flags: {
            active: true,
            editable: true,
            testSeries: true,
            videos: true,
            materials: true,
            flashCards: true,
            questionBank: true,
            mcq: true,
            suggested: true,
          },
          createdOn: new Date(),
          modifiedOn: null,
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
        }
        array.push(cData)
        
      })

      console.log(array);
      
      
      array.map(res => {
        this.syllabusRepository.addSyllabus(res).subscribe(data => {
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

  // async onChapterSubmit() {
  //   const reader: FileReader = new FileReader();
  //   reader.onload = async (e: any) => {
  //     var binaryData = e.target.result;
  //     var base64String = window.btoa(binaryData);
  //     const wb = XLSX.read(base64String, { type: 'base64' });
  //     const newFile = XLSX.write(wb, { bookType: 'csv', type: 'binary' });
  //     var col = newFile.toString().split('\n')
  //     col.shift()
  //     col.map((e, i) => {
  //       if (e.split(",").length > 1) {
  //         col[i] = e.split(',')
  //       }
  //     })
  //     if ((col[col.length - 1].length < 2)) {
  //       col.pop()
  //     }

  //     let data = await col.map(e => ({
  //       uuid: uuid.v4(),
  //       title: e[0],
  //       type: 'CHAPTER',
  //       shortcut: e[1],
  //       order: parseInt(e[2]),
  //       parents: [],
  //       children: [],
  //       imgUrlVideos: '',
  //       suggestedBanner: '',
  //       imgUrlQBank: '',
  //       flags: {
  //         active: true,
  //         editable: true,
  //         testSeries: true,
  //         videos: true,
  //         materials: true,
  //         flashCards: true,
  //         questionBank: true,
  //         mcq: true,
  //         suggested: true,
  //       },
  //       createdOn: new Date(),
  //       modifiedOn: null,
  //       createdBy: {
  //         uuid: localStorage.getItem('currentUserUuid'),
  //         name: localStorage.getItem('currentUserName'),
  //       },
  //     }))
  //     console.log('data', data);


  //     // data.map((userData, i) => {
  //     //   this.syllabusRepository.addSyllabus(userData).subscribe(data => {
  //     //     if (data) {
  //     //       console.log(data);
  //     //     }
  //     //   })
  //     // })


  //   };
  //   reader.readAsBinaryString(this.fileC);
  //   // this.router.navigateByUrl('/manage/users/list');
  // }

  
}
