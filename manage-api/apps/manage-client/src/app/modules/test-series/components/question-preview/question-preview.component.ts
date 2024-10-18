import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionInterface, SelectedQuestionInterface } from '@application/api-interfaces';
import { NotificationService, NotificationType } from '@application/ui';

@Component({
  selector: 'application-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.less'],
})
export class QuestionPreviewComponent implements OnInit {
  @Input() index: number;
  @Input() question: QuestionInterface;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<QuestionInterface>();
  @Input() canSelect?= false;
  @Output() data = new EventEmitter<SelectedQuestionInterface>();
  @Input() assignedQstions: Array<any>;
  isEnabled: boolean;
  selectedQuestion: SelectedQuestionInterface;
  isSelected = false;
  showActions = this.router.url.includes('questions');
  editQuestion = this.router.url.includes('list');
  flags: string[] = [];

  assignQuestion = []
  array = [];
  isDisabled: boolean;
  mode = this.route.snapshot.data['mode'];


  constructor(
    private router: Router,
    private notification: NotificationService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
   // console.log('assignedQstions', this.assignedQstions);
    let questions

    this.assignedQstions?.map(res => {
      questions = {
        isSelected: true,
        negative: res.negative,
        order: res.order,
        positive: res.positive,
        que: res
      }
      this.array.push(questions)
    })
    this.selectedQuestion = {
      que: this.question,
      isSelected: false,
      positive: 1,
      negative: 0,
      order: null,
    }
    this.getFlags();
    this.questionsChecked(this.question);
    if (this.mode) {
      this.emitSelection();
    }
  }

  getFlags() {

    for (const [key, val] of Object.entries(this.question.flags)) {
      if (val) {
        this.flags.push(key);
      }
    }

  }

  toggleQuestion(event, uuid) {

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
      if (this.assignedQstions.length) {
        this.assignedQstions.forEach(element => {
          if (element.uuid === question.uuid) {
            this.selectedQuestion.isSelected = true;
            this.selectedQuestion.order = element.order;
            this.selectedQuestion.positive = element.positive;
            this.selectedQuestion.negative = element.negative;
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

  }

  handleChange(name, event) {
    this.selectedQuestion[name] = parseInt((event.target as HTMLSelectElement).value);
  }

  async emitSelection() {
    if (!this.selectedQuestion.order) {
      this.selectedQuestion.order = 1;
      this.selectedQuestion.positive = 1;
      this.selectedQuestion.negative = 0;
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

   // console.log('this.array', this.array);
    this.isEnabled = true
    this.array.map(res => {
      return this.data.emit(res);
    })


  }

  // emitSelection() {
  //   if (!this.selectedQuestion.order) {
  //     this.selectedQuestion.order = 1;
  //     this.selectedQuestion.positive = 1;
  //     this.selectedQuestion.negative = 0;

  //   }
  //   console.log('this.selectedQuestion', this.selectedQuestion);

  //   if(this.selectedQuestion.isSelected){
  //     this.notification.showNotification({
  //       type: NotificationType.SUCCESS,
  //       payload: {
  //         message: 'Question Assigned Successfully',
  //         statusCode: 200,
  //         statusText: 'Successfully',
  //         status: 201
  //       },
  //     });
  //   }

  //   this.isEnabled = true

  //   return this.data.emit(this.selectedQuestion);

  // }

}
