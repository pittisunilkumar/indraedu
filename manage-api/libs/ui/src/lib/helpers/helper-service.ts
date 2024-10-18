import { Injectable } from '@angular/core';
import { RoleModulesEnum, RoleSubModulesEnum } from '@application/api-interfaces';
import { RolesService } from '@application/ui';

@Injectable()
export class HelperService {
  data: any;
  array = []
  isAccess: boolean
  isAddVisible: boolean
  MODULE:string;
  paymentStatus =[
    {title:'Approved', value: 'Approved', color: 'green' },
    {title:'Pending', value: 'Pending', color: '#FFA500' },
    {title:'Rejected', value: 'Rejected', color: 'red' },
  ]

  TicketStatus=[
    {'title':'NEW',value:1,color:'green'},
    {'title':'TO DO',value:2,color:'#8704BC'},
    {'title':'IN PROGRESS',value:3,color:'#F1C40F'},
    {'title':'CLOSED',value:4,color:'#2664c9'},
    {'title':'REJECTED',value:5,color:'red'},
  ]

  Application_Role = ['ADMIN','BRANCH_ADMIN','EMPLOYEE']

  TicketStatusUpdate=[
    {'title':'NEW',value:1,color:'green'},
    {'title':'TO DO',value:2,color:'#8704BC'},
    {'title':'IN PROGRESS',value:3,color:'#F1C40F'},
    // {'title':'CLOSED',value:4,color:'#2664c9'},
    {'title':'REJECTED',value:5,color:'red'},
  ]

  TicketType=[
    {'title':'BUG',value:1},
    {'title':'FEATURE',value:2},
    {'title':'SUPPORT',value:3},
    {'title':'TASK',value:4},
    {'title':'DOUBT',value:5},
  ] 
  constructor(private roleService: RolesService) {

  }

  editorProperties(){
    return {
      toolbar: {
        items: [
          'code',
          'sourceEditing',
          '|',
          'heading',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'fontFamily',
          'fontSize',
          'fontBackgroundColor',
          'fontColor',
          '|',
          'MathType',
          'ChemType',
          'specialCharacters',
          'insertTable',
          'subscript',
          'superscript',
          '-',
          'indent',
          'outdent',
          'alignment',
          'numberedList',
          'bulletedList',
          '|',
          'imageUpload',
          'imageInsert',
          'link',
          'mediaEmbed',
          '|',
          'blockQuote',
          'highlight',
          'horizontalLine',
          'pageBreak',
          'findAndReplace',
          'removeFormat',
          '|',
          'undo',
          'redo'
        ]
      },
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
          'linkImage'
        ]
      },
      fontFamily: {
        default:'Ramabhadra',
        options: [
          'default',
          'Ramabhadra',
          'Arial, Helvetica, sans-serif',
          'Courier New, Courier, monospace',
          'Georgia, serif',
          'Lucida Sans Unicode, Lucida Grande, sans-serif',
          'Tahoma, Geneva, sans-serif',
          'Times New Roman, Times, serif',
          'Trebuchet MS, Helvetica, sans-serif',
          'Verdana, Geneva, sans-serif'
        ]
      },
      fontSize: {
        options: [
          9,
          11,
          12,
          14,
          16,
          18,
          20,
          22,
          25
        ]
      },
     
      simpleUpload: {
        // The URL that the images are uploaded to.
        uploadUrl: 'http://example.com',

        // Enable the XMLHttpRequest.withCredentials property.
        withCredentials: false,

        // Headers sent along with the XMLHttpRequest to the upload server.
        //headers: {
        //  'X-CSRF-TOKEN': 'CSFR-Token',
        //  Authorization: 'Bearer <JSON Web Token>'
        //}
      },
      // This value must be kept in sync with the language defined in webpack.config.js.
      language: 'en'
    };
  }

  formatDate(date: string) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleString();
  }

  enumtoArray(type: any) {
    return {
      type,
      data: Object.keys(type).filter((k) => k),
    };
  }

  permissions(){
    let modules = this.enumtoArray(RoleModulesEnum);
    let routePath = localStorage.getItem('routePath');

    /////////////  MANAGE //////////////////////
    if (routePath == 'coupons') {
      this.MODULE = modules.type.COUPONS
    }
    else if (routePath == 'courses') {
      this.MODULE = modules.type.COURSES
    }
    else if (routePath == 'faculty') {
      this.MODULE = modules.type.AGENTS
    }
    else if (routePath == 'users') {
      this.MODULE = modules.type.USERS
    }
    else if (routePath == 'subscriptions') {
      this.MODULE = modules.type.SUBSCRIPTIONS
    }
    else if (routePath == 'employee') {
      this.MODULE = modules.type.EMPLOYEE
    }
    else if (routePath == 'user') {
      this.MODULE = modules.type.USER_TRANSACTIONS
    }
    else if (routePath == 'role-sub-modules') {
      this.MODULE = modules.type.ROLE_SUB_MODULES
    }
    else if (routePath == 'role-modules') {
      this.MODULE = modules.type.ROLE_MODULES
    }
    else if (routePath == 'roles') {
      this.MODULE = modules.type.ROLES
    }

    /////////////  BANK //////////////////////
    else if (routePath == 'banners') {
      this.MODULE = modules.type.BANNERS
    }
    else if (routePath == 'questions') {
      this.MODULE = modules.type.QUESTIONS
    }
    else if (routePath == 'tags') {
      this.MODULE = modules.type.QUESTION_TAGS
    }
    else if (routePath == 'syllabus') {
      this.MODULE = modules.type.SYLLABUS
    }
    else if (routePath == 'videoCipher') {
      this.MODULE = modules.type.VIDEO_CYPHER
    }
    else if (routePath == 'mcq-list') {
      this.MODULE = modules.type.MCQ_OF_THE_DAY
    }

    /////////////  TEST SERIES //////////////////////
    else if (routePath == 'categories') {
      this.MODULE = modules.type.TEST_CATEGORIES
    }
    else if (routePath == 'suggested-tests') {
      this.MODULE = modules.type.SUGGESTED_TESTS
    }

    /////////////  QBANK //////////////////////
    else if (routePath == 'qbankSubjects') {
      this.MODULE = modules.type.QBANK_SUBJECT
    }
    else if (routePath == 'suggested-qbank-topics') {
      this.MODULE = modules.type.SUGGESTED_TOPICS
    }

    /////////////  VIDEOS //////////////////////
    else if (routePath == 'videoSubjects') {
      this.MODULE = modules.type.VIDEO_SUBJECT
    }
    else if (routePath == 'suggested-videos') {
      this.MODULE = modules.type.SUGGESTED_VIDEOS
    }

    /////////////  PORTALS //////////////////////
    else if (routePath == 'careers') {
      this.MODULE = modules.type.CAREERS
    }
    else if (routePath == 'messages') {
      this.MODULE = modules.type.USER_MESSAGES
    }
    else if (routePath == 'aboutUs') {
      this.MODULE = modules.type.ABOUT_US
    }
    else if (routePath == 'notifications') {
      this.MODULE = modules.type.NOTIFICATION
    }
  }

  async createPermission() {
   this.permissions();
    let isAccess
    let subM = this.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    // let r = await this.roleService.getRoleById(role).toPromise()
    roleData[0].rolePermissions.find(res => {
      if (res.module[0].title == this.MODULE) {
        let result = res.subModules.find(e => {
          if (e.title == subM.type.ADD) {
            return true;
          }
        })
        isAccess = result ? true : false
      }
    })
    localStorage.setItem('isAccess', isAccess)
    this.data = isAccess
    return true
  }

  async editPermission() {
    this.permissions();
     let isAccess
     let subM = this.enumtoArray(RoleSubModulesEnum);
     let role = localStorage.getItem('role');
     let roleData = JSON.parse(localStorage.getItem('roleData'));

    //  let r = await this.roleService.getRoleById(role).toPromise()
     roleData[0].rolePermissions.find(res => {
       if (res.module[0].title == this.MODULE) {
         let result = res.subModules.find(e => {
           if (e.title == subM.type.EDIT) {
             return true;
           }
         })
         isAccess = result ? true : false
       }
     })
     localStorage.setItem('editAccess', isAccess)
     this.data = isAccess
     return true
   }

   async deletePermission() {
    this.permissions();
     let isAccess
     let subM = this.enumtoArray(RoleSubModulesEnum);
     let role = localStorage.getItem('role');
     let roleData = JSON.parse(localStorage.getItem('roleData'));

    //  let r = await this.roleService.getRoleById(role).toPromise()
     roleData[0].rolePermissions.find(res => {
       if (res.module[0].title == this.MODULE) {
         let result = res.subModules.find(e => {
           if (e.title == subM.type.DELETE) {
             return true;
           }
         })
         isAccess = result ? true : false
       }
     })
     localStorage.setItem('deleteAccess', isAccess)
     this.data = isAccess
     return true
   }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  userAccess() {
    // const type = localStorage.getItem('currentUserType');
    // return type === 'ADMIN' || type === 'SUPER';
  }

  generateMonths() {

    const months = [];

    for (let i = 1; i <= 60; i++) {
      months.push({ name: `${i} month(s)`, value: i });
    }

    return months;

  }

  generateDays() {

    const days = [];

    for (let i = 1; i <= 28; i++) {
      days.push({ name: `${i} days(s)`, value: i });
    }

    return days;

  }

  stringSanitizer(string: string) {

    return string.trim().replace(/[^a-zA-Z0-9]/g, "");

  }

  vdoCipherEpochToDate(utcSeconds: number) {

    // here 0 is the key, which sets the date to the epoch
    const d = new Date(0);
    const seconds = d.setUTCSeconds(utcSeconds);
    return new Date(seconds).toLocaleString();

  }

  convertSecondsToDuration(seconds: number) {

    return new Date(seconds * 1000).toISOString().substr(11, 8);

  }

}
