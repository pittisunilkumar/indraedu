import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { QuestionInterface, SelectedQuestionInterface } from '@application/api-interfaces';
import { QuestionsRepositoryService } from '@application/ui';
import { McqQuestionsComponent } from '..';

@Component({
  selector: 'application-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.less'],
})
export class QuestionPreviewComponent implements OnInit {
  @Input() index: number;

  @Input() isDeleteVisible: boolean;
  @Input() isEditVisible: boolean;
  
  @Input() question: QuestionInterface;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<QuestionInterface>();
  @Input() canSelect?= false;
  @Output() data = new EventEmitter<SelectedQuestionInterface>();

  selectedQuestion: SelectedQuestionInterface;
  isSelected = false;
  showActions = this.router.url.includes('questions');
  editQuestion = this.router.url.includes('list');
  flags: string[] = [];


  constructor(
    private router: Router,
    private questionsRepo: QuestionsRepositoryService,
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.selectedQuestion = {
      que: this.question,
      isSelected: false,
      positive: null,
      negative: null,
      order: null,
    }
    this.getFlags();
  }

  getFlags() {
    for (const [key, val] of Object.entries(this.question.flags)) {
      if (val) {
        this.flags.push(key);
      }
    }

  }

  toggleQuestion(event) {

    this.selectedQuestion.isSelected = event.checked;

    if (!event.checked) {
      this.emitSelection();
    }

  }

  handleChange(name, event) {

    this.selectedQuestion[name] = (event.target as HTMLSelectElement).value;

  }

  emitSelection() {

    console.log(this.selectedQuestion);

    return this.data.emit(this.selectedQuestion);

  }

  editQuestionPreview(question) {
    this.edit.emit(question);
    this.delete.emit(question);
  }
  setQuestionType(question){
    window.localStorage.setItem('questionType',question.type);
    window.localStorage.setItem('path','bank')
   console.log('question.type',question.type);
  }

  mcqQuestion(question) {
    const dialogRef = this.dialog.open(McqQuestionsComponent, {
      data: { payload: question },
      height: '50%'
    });
  }

}
