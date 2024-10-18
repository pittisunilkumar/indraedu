import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseRepositoryService, QBankRepositoryService, QuestionsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-mcq-questions',
  templateUrl: './mcq-questions.component.html',
  styleUrls: ['./mcq-questions.component.less']
})
export class McqQuestionsComponent implements OnInit {
  courses:any;
  subjects:any;
  questionId:string;
  form = new FormGroup({
    course: new FormControl(''),
    subject: new FormControl(''),
  })

  constructor(
    private courseRepo: CourseRepositoryService,
    private qbankRepo: QBankRepositoryService,
    private questionRepo:QuestionsRepositoryService,
    @Inject(MAT_DIALOG_DATA) private data: { payload: any, copyMode: string, type: string },
  ) { }

  ngOnInit(): void {
    this.courseRepo.getAllActiveCourses().subscribe(data=>{
      this.courses = data.response
    })
    this.questionId = this.data.payload._id;

  }

  getSubjects(course) {
    const inputBody = { courseId: course._id };
    this.qbankRepo.getSubjectsByCourseId(inputBody).subscribe(data => {
      this.subjects = data.response[0].syllabus;
    });
  }

  submit(){
    let payload ={
      courseId:this.form.value.course._id,
      subjectId:this.form.value.subject._id,
      questionId:this.questionId,
      status:true,
      createdOn: new Date(),
      createdBy: {
        uuid: localStorage.getItem('currentUserUuid'),
        name: localStorage.getItem('currentUserName'),
      }
    }
    console.log('payload',payload);
    this.questionRepo.mcqOfTheDay(payload).subscribe(data=>{
      if(data.response){

      }
    })
    
  }

}
