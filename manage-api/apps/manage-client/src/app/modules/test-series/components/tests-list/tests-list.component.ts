import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleModulesEnum, RoleSubModulesEnum, TestInterface } from '@application/api-interfaces';
import { HelperService, NotificationService, NotificationType, QuestionsRepositoryService, RolesService, TestsRepositoryService } from '@application/ui';
import { CopyMoveQuestionsComponent } from '../copy-move-questions/copy-move-questions.component';
import * as uuid from 'uuid';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as XLSX from 'xlsx';


@Component({
  selector: 'application-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.less']
})
export class TestsListComponent implements OnInit, OnChanges {

  @Input() tests: TestInterface[];
  @Input() categoryUuid: any

  @Output() delete = new EventEmitter<TestInterface>();
  @Output() edit = new EventEmitter<TestInterface>();
  @Output() viewQuestions = new EventEmitter<TestInterface>();


  filteredList: TestInterface[] | any;
  isBtnEnabled: boolean;
  selectedTestCount: number;
  selectedList: any = []
  allSelected = false;
  allComplete: boolean = false;
  Indeterminate = false;
  editTestVisible: boolean;
  deteteTestVisible: boolean;
  viewQuestionsVisible: boolean;

  QuestionsData: any;
  AllQuestions: any;
  subject_id: string;
  order: number;
  ts_uuid: string;

  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  orderType: string;
  p: number = 1;
  itemsPerPage: number = 10;
  orderValue: number;
  reOrderTopics = [];
  list: any;



  fileName = [];
  isLoading = false;

  file: File | any = null;
  todayDate = new Date();



  constructor(
    public helper: HelperService,
    private dialog: MatDialog,
    private roleService: RolesService,
    private api: QuestionsRepositoryService,
    private testsRepositoryService: TestsRepositoryService,
    private notification: NotificationService,
  ) {
    this.todayDate.setDate(this.todayDate.getDate() - 1)
  }

  ngOnInit() {
    this.loadPermissions();
    // this.ts_uuid = window.sessionStorage.getItem('cUuid');
    this.ts_uuid = window.localStorage.getItem('cUuid');


  }
  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
      roleData[0].rolePermissions.map(res => {
        if (res.module[0].title === modules.type.TESTS)
          res.subModules.map(e => {
            if (e.title == subM.type.DELETE) {
              this.deteteTestVisible = true;
            }
            else if (e.title == subM.type.EDIT) {
              this.editTestVisible = true;
            }
            else if (e.title == subM.type.VIEW_QUESTIONS) {
              this.viewQuestionsVisible = true;
            }
          })
      })
      // })
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    this.list = this.tests = this.filteredList = changes?.tests?.currentValue;
    this.filteredList.map(res => { res.disabled = true })

    console.log('this.tests', this.tests);

  }

  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.tests.filter((question) => {
        return question.title.toLowerCase().includes(filterValue.toLowerCase());
      });
    } else {
      this.filteredList = this.tests;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.orderType == 'dragAndDrop') {
      console.log('event', event);

      this.isChangeBtnEnabled = true;
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      console.log('this.list', this.list);

      this.list.map((res, i) => {
        this.list[i].order = i + 1;
        this.list[i].time = parseInt(res.time)
        // this.list[i].scheduledDate = new Date()
        // this.list[i].scheduledTime = '10:30'

        // this.list[i].pdf = res.pdf?res.pdf:{};
        // this.list[i].icon = res.icon?res.icon:{};
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
      this.filteredList.map(res => { res.disabled = false })

    }
  }
  updateQuestionOrder() {
    console.log('this.list', this.list);
    let testPayload = {
      uuid: this.categoryUuid,
      // from_test: this.testUuid,
      tests: this.list
    }
    console.log(testPayload);
    if (testPayload) {
      this.testsRepositoryService.dragAndDropTests(testPayload).subscribe(data => {
        if (data) {
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }

  toggleQuestion(event, test) {

    const Quuid = test.uuid;
    let index: number;
    if (event.checked) {
      this.selectedList = [...this.selectedList, test];
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
    this.selectedTestCount = this.selectedList.length;

    console.log(this.selectedList);
  }



  setAll(completed: boolean) {
    if (completed == true) {
      this.allSelected = true;
      this.tests.map(res => {
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
    this.selectedTestCount = this.selectedList.length;
    console.log(this.selectedList);
  }

  checkBoxChecked() {
    if (this.tests.length == this.selectedList.length) {
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

  getTestUUid(test) {
    // window.sessionStorage.setItem('testSubjects', JSON.stringify(test.subjects));
    // window.sessionStorage.setItem('testUuid', test.uuid);
    // window.sessionStorage.setItem('testName', test.title);

    window.localStorage.setItem('testSubjects', JSON.stringify(test.subjects));
    window.localStorage.setItem('testUuid', test.uuid);
    window.localStorage.setItem('testName', test.title);
  }


  onCopy() {
    const dialogRef = this.dialog.open(CopyMoveQuestionsComponent, {
      data: { payload: this.selectedList, copyMode: 'tests', type: 'copy' },

    });
  }
  onMove() {
    const dialogRef = this.dialog.open(CopyMoveQuestionsComponent, {
      data: { payload: this.selectedList, copyMode: 'tests', type: 'move' },

    });
  }


  onFileSelected(event: any, i) {
    this.fileName[i] = event.target.files[0].name;
    console.log(this.fileName);

    this.file = event.target.files[0];
  }


  FileTestQueSubmited(test) {
    console.log('test', test);

    let testSubjects = test.subjects;

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
          type: 'SINGLE',
          // options: JSON.parse(res.options),
          // answer: JSON.parse(res.Answer),
          options: res.options,
          answer: res.Answer,
          imgUrl: res.Question_image == "" ? '' : res.Question_image,
          description: res.description == "" ? 'description' : res.description,
          // difficulty: res.difficulty == "" ? 'EASY' : res.difficulty,
          difficulty: 'EASY',
          previousAppearances: res.previous_apperance == '' ? '' : res.previous_apperance,
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
          syllabus: testSubjects.map(res => res._id),
          mathType: res.math_library,
          descriptionImgUrl: res.description_image == "" ? '' : res.description_image,
          createdOn: new Date().toISOString().toString(),
          createdBy: {
            uuid: localStorage.getItem('currentUserUuid'),
            name: localStorage.getItem('currentUserName'),
          },
          modifiedOn: null,
          shortTitle: res.Question.replace(/<(.|\n)*?>/g, '')
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
      find_duplicate_in_array(array)
      result.map(res => {
        array.push(res)
      })
      console.log('finalArray', array);
      let tsQuestions = {
        ts_uuid: this.categoryUuid,
        test: test.uuid,
        que: array,
        test_que: [],
        date: new Date()
      }

      console.log('testQuestions', tsQuestions);
      this.api.testBulkQuestion(tsQuestions).subscribe(data => {
        if (data.response) {
          window.location.reload()
        }
      })
    }
    fileReader.onerror = (error) => {
      console.log(error);
    }

  }

  updateShortName() {
    let array = []
    this.filteredList.map(res => {
      res.que.map(que => {
        array.push(que)
      })
    })
    console.log('array', array);
    this.api.updateShortTitle(array).subscribe(data => {
      if (data) {
        window.location.reload();
      }
    })
  }

  async testAttemptedList(test, i) {
    this.isLoading = true;
    let data = {
      courseId: localStorage.getItem('courseId'),
      categoryUuid: this.categoryUuid,
      testSeriesUuid: test.uuid
    }
    let sheet = await this.testsRepositoryService.testAttemptedList(data).toPromise();
    console.log('sheet', sheet);
    if (sheet.response.length === 0) {
      this.isLoading = false;
      // alert("No data available for ExportData");
      this.notification.showNotification({
        type: NotificationType.ERROR,
        payload: {
          message: 'No data available',
          statusCode: 200,
          statusText: 'Successfully',
          status: 201
        },
      });
    }
    else {
      this.isLoading = false;
      const dataToExport = sheet.response
        .map(x => ({
          Name: x?.users.name ? x?.users.name : '---',
          Mobile: x?.users.mobile ? x?.users.mobile : '---',
          SecureMarks:x?.stats ? x?.stats.secureMarks ? x?.stats.secureMarks : '0':'0',
          TotalMarks:x?.stats ? x?.stats.totalMarks ? x?.stats.totalMarks : '0':'0',
          TotalUsers: x?.totalUsers ? x?.totalUsers : '---',
          StartedAt: x?.startedAt ? x?.startedAt : '---',
          StoppedAt: x?.stoppedAt ? x?.stoppedAt : '---',
          CompletedMCQ: x?.completedMcq ? x?.completedMcq : '---',
          SubmittedOn: x?.submittedOn ? x?.submittedOn : '---',
        }));

      let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <XLSX.Table2SheetOpts>{ sheet: 'Sheet 1' });
      let workBook: XLSX.WorkBook = XLSX.utils.book_new();

      // Adjust column width
      var wscols = [
        { wch: 15 }
      ];

      workSheet["!cols"] = wscols;
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
      XLSX.writeFile(workBook, `${test.title}.xlsx`);

      this.notification.showNotification({
        type: NotificationType.SUCCESS,
        payload: {
          message: 'User List Downloaded Successfully',
          statusCode: 200,
          statusText: 'Successfully',
          status: 201
        },
      });
    }
  }


}
