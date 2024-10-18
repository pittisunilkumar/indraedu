import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { matchLeftOptionsInterface, MatchQuestionAnswerInterface, matchRightOptionsInterface, QuestionAnswerInterface, QuestionFollowingOptionsInterface, QuestionInterface, QuestionOptionsInterface, SyllabusInterface, TagInterface } from '@application/api-interfaces';
import { AWSS3Service, HelperService, QuestionsRepositoryService, SyllabusRepositoryService, TagsRepositoryService } from '@application/ui';
import * as uuid from 'uuid';
// import * as Editor from 'apps/manage-client/src/assets/ckeditor5-31.0.0-sttok6yne3zl'

@Component({
  selector: 'application-create-match-questions',
  templateUrl: './create-match-questions.component.html',
  styleUrls: ['./create-match-questions.component.less']
})
export class CreateMatchQuestionsComponent implements OnInit {
  // public Editor = Editor
  @Input() Editor: any;

  public config: any;

  @Input() syllabus: SyllabusInterface[];
  @Input() question: any;
  @Input() mode: string;
  @Input() questionType: string;
  @Output() review = new EventEmitter<QuestionInterface[]>();
  @Output() commit = new EventEmitter();
  subjects: SyllabusInterface[];
  tags: TagInterface[];
  tagsList: any;

  sentence = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  createQuestionForm: FormGroup;
  // type = "SINGLE";
  questionsArray: any[] = [];
  imgUrl: string;
  optionsCount = 4;
  followingOptionsCount = 4;
  answerCount = 4;

  ansArray: number[] = [];
  path: string;
  subjectName: string;
  subject_id: string;
  testSubjects: any;
  alphabet: string;


  constructor(
    private formBuilder: FormBuilder,
    private awsS3: AWSS3Service,
    private syllabusRepository: SyllabusRepositoryService,
    private questionService: QuestionsRepositoryService,
    private tagsRepo: TagsRepositoryService,
    public helper: HelperService
  ) {
    this.config = this.helper.editorProperties()
  }

  ngOnInit(): void {
    console.log('questionType', this.questionType);

    this.path = window.localStorage.getItem('path');
    this.subjectName = window.localStorage.getItem('subjectName');
    this.subject_id = window.localStorage.getItem('syllabus_id');
    this.testSubjects = JSON.parse(window.localStorage.getItem('testSubjects'));
    this.buildForm();
    if (this.mode === 'add') {
      this.leftSideOptions(this.optionsCount);
      this.RigthSideOptions(this.followingOptionsCount);
      this.addAnswerOtion(this.answerCount);
      // this.addOptions(this.followingOptionsCount)
    }
    this.syllabusRepository.getAllSubjects().subscribe(data => {
      this.subjects = data
    })
    this.tagsRepo.getAllTags().subscribe(data => {
      this.tags = data.response;
      this.tagsList = new MatTableDataSource(this.tags)
    })

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.question?.currentValue) {
      this.question = changes?.question?.currentValue;
      this.buildForm();
    }

  }
  tagsFilter(event: any) {
    this.tagsList.filter = event.target.value.trim().toLowerCase();
    this.tags = this.tagsList.filteredData;
  }

  buildForm() {
    console.log('this.question', this.question);
    let matchAnswer = []
    this.question?.matchAnswer.map((res, i) => {
      res.map(e => {
        matchAnswer.push({ 'name': e })
      })
    })
    console.log('matchAnswer', matchAnswer);

    this.createQuestionForm = this.formBuilder.group({
      title: [this.question ? this.question?.title : '', Validators.required],
      matchLeftSideOptions: this.formBuilder.array(
        this.question ?
          this.question?.matchLeftSideOptions.map((option, index) => this.newOption(index, option)) : []
      ),
      matchRightSideOptions: this.formBuilder.array(
        this.question ?
          this.question?.matchRightSideOptions.map((option, index) => this.newFollowingOption(index, option)) : []
      ),

      answer: this.formBuilder.array(
        this.question ? matchAnswer.map((option, index) => this.newFollowingAnswer(index, option)) : []
      ),

      imgUrl: this.formBuilder.group({
        imgUrl: this.question ? this.question?.imgUrl : '',
        upload: false,
      }),
      description:[ this.question ? this.question?.description : '', Validators.required],
      difficulty: [this.question ? this.question?.difficulty : '', Validators.required],
      previousAppearances: this.question ? this.question?.previousAppearances : '',
      tags: this.question ? this.question?.tags : null,
      flags: this.formBuilder.group({
        pro: this.question ? this.question?.flags.pro : false,
        editable: this.question ? this.question?.flags.editable : true,
        qBank: this.question ? this.question?.flags.qBank : true,
        active: this.question ? this.question?.flags.active : true,
        testSeries: this.question ? this.question?.flags.testSeries : true,
      }),
      syllabus: [this.question ? this.question.syllabus : [], Validators.required],
      mathType: [this.question ? this.question.mathType :'no', Validators.required],
      descriptionImgUrl: this.formBuilder.group({
        imgUrl: this.question ? this.question?.descriptionImgUrl : '',
        upload: false,
      }),
    });

  }

  get matchLeftSideOptions(): FormArray {
    return this.createQuestionForm?.get('matchLeftSideOptions') as FormArray;
  }
  get qOptions(): FormArray {
    return this.createQuestionForm?.get('matchRightSideOptions') as FormArray;
  }
  get answer(): FormArray {
    return this.createQuestionForm?.get('answer') as FormArray;
  }

  addNewOption() {
    ++this.optionsCount;
    this.addNewqOption();
    this.addAnswer();
    return this.matchLeftSideOptions?.push(this.newOption(this.optionsCount));
  }

  addNewqOption() {
    ++this.followingOptionsCount;
    return this.qOptions?.push(this.newFollowingOption(this.followingOptionsCount));
  }

  addAnswer() {
    ++this.answerCount;
    return this.answer?.push(this.newFollowingAnswer(this.answerCount));
  }

  newOption(index: number, option?: matchLeftOptionsInterface): FormGroup {
    console.log('index,index', index);
    // console.log(this.newOption(this.optionsCount));
    return this.formBuilder.group({
      name: option ? option.name : '',
      value: ++index,
      imgUrl: option ? option.imgUrl : '',
      upload: option ? option.imgUrl !== '' ? false : true : false,
    });

  }

  newFollowingOption(index: number, option?: matchRightOptionsInterface): FormGroup {
    const sentence = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.alphabet = sentence.charAt(index + 1)
    return this.formBuilder.group({
      name: option ? option.name : '',
      value: sentence.charAt(++index),
      imgUrl: option ? option.imgUrl : '',
      upload: option ? option.imgUrl !== '' ? false : true : false,
    });
  }
  newFollowingAnswer(index: number, option?: MatchQuestionAnswerInterface): FormGroup {

    return this.formBuilder.group({
      name: option ? option.name : '',
    });
  }

  leftSideOptions(count: number) {
    for (let i = 0; i < count; i++) {
      this.matchLeftSideOptions?.push(this.newOption(i));
    }

  }
  RigthSideOptions(count: number) {
    for (let i = 0; i < count; i++) {
      this.qOptions?.push(this.newFollowingOption(i));
    }

  }
  addAnswerOtion(count: number) {
    for (let i = 0; i < count; i++) {
      this.answer?.push(this.newFollowingAnswer(i));
    }

  }

  removeOption(i) {
    this.answer.removeAt(i)
    this.qOptions.removeAt(i)
    return this.matchLeftSideOptions.removeAt(i)
  }


  getImageUrl(data: { fileUrl: string; upload: boolean }) {
    this.createQuestionForm.controls['imgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }
  getDescriptionImgUrl(data: { fileUrl: string; upload: boolean }) {
    this.createQuestionForm.controls['descriptionImgUrl'].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }

  getOptionsUrl(data: { fileUrl: string; upload: boolean }, index: string) {
    this.createQuestionForm.get('matchLeftSideOptions')['controls'][index].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }
  getFollowingOptionsUrl(data: { fileUrl: string; upload: boolean }, index: string) {
    this.createQuestionForm.get('matchRightSideOptions')['controls'][index].patchValue({
      imgUrl: data.fileUrl,
      upload: data.upload,
    });
  }


  toggleImgUrlTextBox(event) {
    event.target.value = event.target.checked;
  }

  compareFn(c1: SyllabusInterface, c2: SyllabusInterface): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  buildQuestionsArray() {
    const createForm = this.createQuestionForm.value;
    console.log('createForm', createForm);
    let answers = []
    createForm.answer.map(res => {
      answers.push([res.name.toUpperCase()])
    })
    let syllabus_id: any
    if (this.path == 'Qbank') {
      syllabus_id = [this.subject_id]
    }
    else if (this.path == 'test_series') {
      syllabus_id = this.testSubjects.map(res => res._id)
    }
    else {
      // syllabus_id = createForm.syllabus.map(res => res._id)
      syllabus_id = createForm.syllabus.map(res => res)
    }

    if (this.mode === 'add') {

      const question: any = {
        uuid: uuid.v4(),
        title: createForm.title,
        type: this.questionType,
        matchLeftSideOptions: createForm.matchLeftSideOptions,
        matchRightSideOptions: createForm.matchRightSideOptions,
        matchAnswer: answers,
        imgUrl: createForm.imgUrl.imgUrl?createForm.imgUrl.imgUrl:'',
        description: createForm.description,
        difficulty: createForm.difficulty,
        previousAppearances: createForm.previousAppearances,
        tags: createForm.tags,
        flags: createForm.flags,
        createdOn: new Date(),
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        testSeries: null,
        syllabus: syllabus_id,
        descriptionImgUrl: createForm.descriptionImgUrl.imgUrl?createForm.descriptionImgUrl.imgUrl:'',
        mathType:createForm.mathType,
        questionId:'',
      };
      console.log(question);

      this.questionsArray.push(question);

    } else {

      const question: any = {
        uuid: this.question.uuid,
        title: createForm.title,
        type: this.questionType,
        matchLeftSideOptions: createForm.matchLeftSideOptions,
        matchRightSideOptions: createForm.matchRightSideOptions,
        matchAnswer: answers,
        imgUrl: createForm.imgUrl.imgUrl?createForm.imgUrl.imgUrl:'',
        description: createForm.description,
        difficulty: createForm.difficulty,
        previousAppearances: createForm.previousAppearances,
        tags: createForm.tags,
        flags: createForm.flags,
        createdOn: this.question.createdOn,
        createdBy: this.question.createdBy,
        modifiedOn: new Date(),
        modifiedBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
        testSeries: null,
        syllabus: createForm.syllabus,
        descriptionImgUrl: createForm.descriptionImgUrl.imgUrl?createForm.descriptionImgUrl.imgUrl:'',
        mathType:createForm.mathType,
        shortTitle:createForm.mathType=='no'?createForm.title.replace(/<(.|\n)*?>/g, '').trim():''

      };

      this.questionsArray.push(question);

    }

    // this.createQuestionForm.reset();
    // this.createQuestionForm.get('type').setValue(createForm.type);
  }

  onSubmit() {
    this.commit.emit();
  }

  onReview() {
    this.buildQuestionsArray();
    this.review.emit(this.questionsArray);
  }
  // checkQuestion(question){
  //   this.questionService.CheckQuestionBeforeAdd(question[0]).subscribe(data=>{
  //     console.log(data);
  //   })
  // }

  onReset() {
    this.createQuestionForm.reset();
  }

}
