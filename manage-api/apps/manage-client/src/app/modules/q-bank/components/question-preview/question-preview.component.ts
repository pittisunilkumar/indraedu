import { Component, EventEmitter, Input, OnInit, Output, OnChanges, Pipe } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionInterface, SelectedQuestionInterface } from '@application/api-interfaces';
import { NotificationService, NotificationType, QuestionsRepositoryService } from '@application/ui';

@Component({
  selector: 'application-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.less'],
})


export class QuestionPreviewComponent implements OnInit, OnChanges {
  @Input() index: number;
  @Input() question: QuestionInterface;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<QuestionInterface>();
  @Input() canSelect?= false;
  @Output() data = new EventEmitter<SelectedQuestionInterface>();
  @Input() assignedQstions: Array<any>;
  selectedQuestion: SelectedQuestionInterface;
  showActions = this.router.url.includes('questions');
  editQuestion = this.router.url.includes('list');
  flags: string[] = [];
  assignQuestion = []
  isEnabled: boolean;
  array = [];
  isDisabled:boolean;
  mode = this.route.snapshot.data['mode'];



  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private notification: NotificationService,
    private questionService:QuestionsRepositoryService
  ) { }

  ngOnInit(): void {
    console.log('assignedQstions', this.assignedQstions);
    let questions
    
    this.assignedQstions?.map(res => {
        questions = {
        isSelected: true,
        negative: null,
        order: res.order,
        positive: null,
        que: res
      }
      this.array.push(questions)
    })

    this.selectedQuestion = {
      que: this.question,
      isSelected: false,
      positive: null,
      negative: null,
      order: null,
    }
    this.getFlags();
    // this.assignedQuestionsList();
    this.questionsChecked(this.question);
    if(this.mode){
      this.emitSelection();
    }
  }
  ngOnChanges() {
    // this.questionsChecked(this.question);
  }

  // assignedQuestionsList() {
  //   console.log(this.assignedQstions);

  //   if (this.assignedQstions) {
  //     this.assignedQstions.map(res => {
  //       console.log(res);
  //      this.assignQuestion.push(res.uuid) 
  //       if (res.uuid === this.question.uuid) {
  //         this.selectedQuestion.isSelected = true;
  //         this.selectedQuestion.order = res.order;
  //         this.question.checked = true;
  //         this.emitSelection();
  //         return;
  //       }
  //     })
  //   }
  // }

  getFlags() {

    for (const [key, val] of Object.entries(this.question.flags)) {
      if (val) {
        this.flags.push(key);
      }
    }

  }

  toggleQuestion(event,uuid) {    
    this.selectedQuestion.isSelected = event.checked;
    if (!event.checked) {
      this.emitSelection();
      this.array = this.array.filter(res => {        
        return res.que.uuid != uuid
      })
    }
    else {
      this.isEnabled = false
    }
  }
  questionsChecked(question) {
    // console.log(' console.log(question.uuid);', question.uuid);
    // console.log('this.assignedQstions', this.assignedQstions);
    if (!question) {
      console.log('data is undefined!!!!');
    }
    else {
      if (this.assignedQstions?.length) {
        this.assignedQstions.forEach(element => {
          if (element.uuid === question.uuid) {
            this.selectedQuestion.isSelected = true;
            this.selectedQuestion.order = element.order;
            this.isDisabled= true
            this.question.checked = true;
            this.emitSelection();
            return;
          } else {
            this.question.checked = false;
          }
        });
      }
    }



    // if (this.assignedQstions.includes(question.uuid)) {
    //   console.log(question.uuid);
    //   this.selectedQuestion.isSelected = true;
    //   this.question.checked = true;
    //   this.emitSelection();
    // } else {
    //   this.question.checked = false;
    // }
  }

  handleChange(name, event) {
    this.selectedQuestion[name] = (event.target as HTMLSelectElement).value;

    // let orderValue = (event.target as HTMLSelectElement).value;
    // this.assignedQstions.map(res => {
    //   console.log(res); 
    //   if (res.order == orderValue) {
    //     console.log(this.selectedQuestion);
    //     this.selectedQuestion.order = 10 
    //   }
    // })

    // this.emitSelection()
  }


 async emitSelection() {
    if (!this.selectedQuestion.order) {
      this.selectedQuestion.order = 1;
    }
    if (this.selectedQuestion.isSelected) {
      //let uuid = this.selectedQuestion.que.uuid;
      // this.array = this.array?.filter(it => {
      //   return it.que.uuid != uuid;
      // });
      this.array.push(this.selectedQuestion)
      this.notification.showNotification({
        type: NotificationType.SUCCESS,
        payload: {
          message: 'Question Assigned Successfully',
          statusCode: 200,
          statusText: 'Successfully',
          status: 201
        },
      });
    }
    // else if((this.selectedQuestion.isSelected == false)) {
    //   let uuid = this.selectedQuestion.que.uuid
    //   this.array = this.array.filter(res => {
    //     return res.que.uuid != uuid
    //   })
    // }
   
   console.log('this.array',this.array);
    this.isEnabled = true
    this.array.map(res => {
        return this.data.emit(res);
    })


  }


}
