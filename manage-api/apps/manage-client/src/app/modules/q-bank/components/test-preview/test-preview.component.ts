import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { QBankInterface, QBankSubjectChapterInterface, TestInterface } from '@application/api-interfaces';
import { CopyQuestionsComponent } from '../copy-questions/copy-questions.component';
import * as uuid from 'uuid';
import { QBankRepositoryService, QuestionsRepositoryService } from '@application/ui';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


@Component({
  selector: 'application-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestPreviewComponent implements OnInit {

  @Input() topics: QBankInterface[] | any;

  @Input() chapteruuid: any;


  @Input() viewTopicQueEnable: boolean; 
  @Input() editTopicEnable: boolean; 
  @Input() deleteTopivEnabled: boolean; 

  @Output() delete = new EventEmitter<TestInterface>();
  @Output() multipletDelete = new EventEmitter<TestInterface>();
  @Output() edit = new EventEmitter<TestInterface>();
  @Output() viewQuestions = new EventEmitter<TestInterface>();
  @Output() selectedList:any=[]
  allSelected = false;
  allComplete: boolean = false;
  Indeterminate = false;
  isBtnEnabled:boolean;
  list:QBankInterface[];
  selectedTopicCount:number;




  order: number;
  QuestionsData: any;
  fileName = [];
  file: File | any = null;
  subject_id: string;
  AllQuestions: any;
  qBankSubjectUuid: string;
  qBankChapterUuid: string;
  qBankTopicUuid: string;

  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  orderType: string;
  p: number = 1;
  itemsPerPage:number = 10;
  orderValue: number;
  reOrderTopics = []




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private api: QuestionsRepositoryService,
    private qbankRepo: QBankRepositoryService,
  ) { }

  ngOnInit(): void {
    this.list = this.topics;
    this.topics.map(res=>{res.disabled = true})

    console.log(this.list);
    // this.subject_id = window.sessionStorage.getItem('syllabus_id');
    // this.qBankSubjectUuid = window.sessionStorage.getItem('subjectUuid');
    // this.qBankChapterUuid = window.sessionStorage.getItem('chapteruuid');
    // this.qBankTopicUuid = window.sessionStorage.getItem('topicUuid');

    this.subject_id = window.localStorage.getItem('syllabus_id');
    this.qBankSubjectUuid = window.localStorage.getItem('subjectUuid');
    this.qBankChapterUuid = window.localStorage.getItem('chapteruuid');
    this.qBankTopicUuid = window.localStorage.getItem('topicUuid');

  }

  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.topics = this.list.filter((topic) => {
        return (
          topic.title.toLowerCase().includes(filterValue.toLowerCase())||
          topic.flags?.paid.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) 
          // topic.flags?.active.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
          // topic.flags?.suggested.toString().toLowerCase().includes(filterValue.toLocaleLowerCase()) 
          )
      });
    } else {
      this.topics = this.list;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.orderType == 'dragAndDrop') {
      this.isChangeBtnEnabled = true;
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.list.map((res, i) => {
        this.list[i].order = i + 1;
        this.list[i].pdf = res.pdf?res.pdf:{};
        this.list[i].icon = res.icon?res.icon:{};
      })
    }
  }

  selectOrderType(event) {
    this.orderType = event.value;
    if (this.orderType == 'type') {
      this.isInputEnabled = true;
      this.isChangeBtnEnabled = true;
    }
    else if (this.orderType == 'dragAndDrop') {
      this.isInputEnabled = false;
      this.topics.map(res=>{res.disabled = false }) 

    }
  }
  updateQuestionOrder() {
    console.log('this.list',this.list);
    let topicssPayload = {
      from_subject: this.qBankSubjectUuid,
      from_chapter: this.chapteruuid,
      topics: this.list
    }
    console.log(topicssPayload);
    if(topicssPayload){
      this.qbankRepo.dragAndDropQBTopics(topicssPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }



  toggleQuestion(event, topic) {
    const Quuid = topic.uuid;
    let index: number;
    if (event.checked) {
      this.selectedList = [...this.selectedList, topic];
    }
    else {
      this.selectedList?.filter((it, ind) => {
        if (it.uuid === Quuid) {
          index = ind;
        }
      });
      this.selectedList?.splice(index, 1);
    }
    this.checkBoxChecked();
    this.selectedTopicCount = this.selectedList.length;
    
    console.log(this.selectedList);
  }



  setAll(completed: boolean) {
    if (completed == true) {
      this.allSelected = true;
      this.topics.map(res => {
        const arr = this.selectedList?.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedList?.push(res);
        }
      })
    }
    else {
      this.allSelected = false
      this.selectedList = []
    }
    this.checkBoxChecked();
    this.selectedTopicCount = this.selectedList.length;
    console.log(this.selectedList);
  }

  checkBoxChecked(){
    if (this.topics.length == this.selectedList.length) {
      this.Indeterminate = false
      this.allComplete = true
      this.isBtnEnabled = true
    }
    else {
      if (this.selectedList.length == 0) {
        this.Indeterminate = false;
        this.allComplete = false;
        this.isBtnEnabled = false;
      }
      else if (this.selectedList.length > 0) {
        this.Indeterminate = true;
        this.isBtnEnabled = true
      }
    }
  }

  getTopicUUid(topic){
    console.log('topicName',topic.title);
    // window.sessionStorage.setItem('topicUuid',topic.uuid);
    // window.sessionStorage.setItem('topicName',topic.title);

    window.localStorage.setItem('topicUuid',topic.uuid);
    window.localStorage.setItem('topicName',topic.title);
  }

  onCopy(){
    const dialogRef = this.dialog.open(CopyQuestionsComponent, {
      data: { payload: this.selectedList,copyMode:'topics',type:'copy' },
      height:'60%'
    });
  }
  onMove(){
    const dialogRef = this.dialog.open(CopyQuestionsComponent, {
      data: { payload: this.selectedList,copyMode:'topics',type:'move' },
      height:'60%'
    });
  }

  multipletDeleteTopics(){
    this.multipletDelete.emit(this.selectedList);
    this.isBtnEnabled = false;
  }


  onFileSelected(event: any,i) {
    this.fileName[i] = event.target.files[0].name;
    this.file = event.target.files[0];
  }

  FileTopicQueSubmited(topic) {
   // console.log('chapteruuid',this.chapteruuid);
    
    this.order = 0
    let array = [];
    let questionsList = [];
    const fileReader: any = new FileReader();
    fileReader.readAsText(this.file, "UTF-8");
    fileReader.onload = async () => {
      this.QuestionsData = JSON.parse(fileReader.result);
      this.QuestionsData.map(res => {
        let cData = {
          uuid: uuid.v4(),
          title: res.Question,
          // title: res.Question == ""?"<p>See the below image</p>":res.Question,
          type: 'SINGLE',
          // options: JSON.parse(res.options),
          // answer: JSON.parse(res.Answer),
          options: res.options,
          answer: res.Answer,
          description: res.description == "" ? 'description' : res.description,
          difficulty: res.difficulty == "" ? 'EASY' : res.difficulty,
          previousAppearances: res.previous_apperance == '' ?  '':res.previous_apperance ,
          perals: [],
          tags: null,
          // questionId: res.question_id,
          questionId: '',
          flags: {
            pro: false,
            editable: true,
            qBank: true,
            active: true,
            testSeries: true,
          },
          testSeries: null,
          order: parseInt(res.Question_order),

          // syllabus: [res.syllabus]
          syllabus: [this.subject_id],
          mathType: res.math_library,
          imgUrl: res.Question_image == "" ? '' : res.Question_image,
          descriptionImgUrl: res.description_image == "" ? '' : res.description_image,
          createdOn: new Date().toISOString().toString(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
        }
        array.push(cData)
      })
      console.log('array', array);
      let result = []
      function find_duplicate_in_array(arr) {
        const count = {}
        arr.forEach(item => {
          if (count[item.title.replace(/<(.|\n)*?>/g, '')]) {
            count[item.title.replace(/<(.|\n)*?>/g, '')] += 1
            array = array.filter(res => {
              return res.title.replace(/<(.|\n)*?>/g, '') != item.title.replace(/<(.|\n)*?>/g, '')
            })
            result.push(item)
            return
          }
          count[item.title.replace(/<(.|\n)*?>/g, '')] = 1
        })
      }
      find_duplicate_in_array(array);
      console.log('result',result);
      
      result.map(res => {
        array.push(res)
      })
      // console.log('array123', array);

      // this.AllQuestions = await this.api.getAllQuestions().toPromise();
      // this.AllQuestions.response.find(QDATA => {
      //   array.map(e => {
      //     // if (QDATA.title.replace(/<(.|\n)*?>/g, '') == e.title.replace(/<(.|\n)*?>/g, '') && QDATA.imgUrl == e.imgUrl) {
      //     if (QDATA.title.replace(/<(.|\n)*?>/g, '') == e.title.replace(/<(.|\n)*?>/g, '') ) {
      //       questionsList.push({ "uuid": QDATA.uuid, 'order': this.order + 1 });
      //       QDATA.syllabus = QDATA.syllabus.filter(res => {
      //         return res._id != this.subject_id
      //       })
      //       QDATA.syllabus.push({_id:this.subject_id})
      //       questionsList.map(res => {
      //         this.order = res.order;
      //       })
      //       // console.log('QDATA',QDATA);
      //       // this.api.editQuestionByJsonFile(QDATA).subscribe((res) => { } );
      //       array = array.filter(res => {
      //         return res.title.replace(/<(.|\n)*?>/g, '') != e.title.replace(/<(.|\n)*?>/g, '')
      //       })
      //     }
      //   })
      // })
      // array.map(res => {
      //   questionsList.push({ "uuid": res.uuid, 'order': this.order + 1 })
      //   questionsList.map(res => {
      //     this.order = res.order;
      //   })
      // })

      console.log('finalArray', array);
      let QbankQuestions = {
        qbank_subject: this.qBankSubjectUuid,
        // qbank_chapter: this.qBankChapterUuid,
        // qbank_topic: this.qBankTopicUuid,topic.uuid
        qbank_chapter: this.chapteruuid,
        qbank_topic: topic.uuid,
        que: array,
        qbank_que: [],
        date: new Date()
      }
      console.log('QbankQuestions', QbankQuestions);
      this.api.qbankBulkQuestion(QbankQuestions).subscribe(data => {
      //   // this._location.back();
      //   // console.log('data.response',data.response);
        
        if(data.response){
          window.location.reload()
        }
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }
}
