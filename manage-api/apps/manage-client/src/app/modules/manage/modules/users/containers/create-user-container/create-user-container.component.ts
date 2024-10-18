import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseInterface, UserInterface } from '@application/api-interfaces';
import { NotificationService, NotificationType, UsersRepositoryService } from '@application/ui';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as uuid from 'uuid';
import { interval, Subscription } from 'rxjs';



@Component({
  selector: 'application-create-user-container',
  templateUrl: './create-user-container.component.html',
  styleUrls: ['./create-user-container.component.less'],
})
export class CreateUserContainerComponent implements OnInit {

  mode = this.route.snapshot.data['mode'];
  user$: Observable<ResponseInterface<UserInterface>>;
  errors: string[];
  mySubscription: Subscription

  fileName: any;
  file: File | any = null;
  filePreview: string | any;

  constructor(
    private userRepo: UsersRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private notification: NotificationService,


  ) { }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.user$ = this.getUserByUuid();
    }
  }

  getUserByUuid() {
    return this.route.paramMap.pipe(
      switchMap((params) => {
        return this.userRepo.getUserByUuid(params.get('uuid'));
      })
    );
  }

  submit(event: UserInterface) {

    if (this.mode === 'add') {
      this.userRepo
        .addUser(event)
        .pipe(take(1))
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/users/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    } else {
      this.userRepo
        .editUser(event)
        .pipe(take(1))
        .subscribe(
          (result) => {
            console.log({ result });
            this.router.navigateByUrl('/manage/users/list');
          },
          (err) => {
            this.errors = err.error.error;
          }
        );
    }
  }

  onFileSelected(event: any) {
    this.fileName = event.target.files[0].name;
    this.file = event.target.files[0];
  }

  async onSubmit() {
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
      let address = {
        addressLine1: "",
        addressLine2: "",
        state: "",
        town: "",
        pincode: ""
      }
      let flags = {
        isActive: true
      }
      let data = await col.map(e => ({
        uuid: uuid.v4(),
        name: e[0] ? e[0] : 'abcd',
        email: e[1] ? e[1] : 'abc@gmail.com',
        mobile: e[2] ? parseInt(e[2]) : 123,
        type: 'STUDENT',
        dob: new Date(),
        courses: undefined,
        college: e[4] ? e[4] : '',
        organizations: [],
        subscriptions: [],
        qbanks: [],
        videos: [],
        tests: [],
        address: address,
        flags: flags,
        imgUrl: e[4] ? e[4] : '',
        createdOn: new Date(),
        modifiedOn: null,
        gender: 'MALE',
        // createdOn:e[5],
        // modifiedOn:e[6],
        // gender: e[3] ? e[3] : '',
        password: 'password',
        createdBy: {
          uuid: localStorage.getItem('currentUserUuid'),
          name: localStorage.getItem('currentUserName'),
        },
      }))
      // data.map((resData))
      this.userRepo.addManyUsers(data).subscribe(data => {
        if (data) {
          this.snackBar.open('Added Successfully!', 'Success', {
            duration: 2000,
          });
        }
      })


      // let array = [5000]
      // array.forEach(element => {
      //   // console.log('element', element);
      //   // this.mySubscription = interval(10000).subscribe((x => {
      //   // }));
      //   for (let i = 4001; i <= element; i++) {
      //       this.userRepo.addUser(data[i]).subscribe(data => {
      //         console.log(data.response);
      //         if (data) {
      //           this.notification.showNotification({
      //             type: NotificationType.SUCCESS,
      //             payload: {
      //               message: 'User Created successfully',
      //               statusCode: 200,
      //               statusText: 'Successfully',
      //               status: 201
      //             },
      //           });
      //         }
      //       })
      //     }
      // });


      // data.map((userData, i) => {
      //   this.userRepo.addUser(userData).subscribe(data => {
      //     if (data) {
      //       this.snackBar.open('Added Successfully!', 'Success', {
      //         duration: 2000,
      //       });
      //     }
      //   })
      // })


    };
    reader.readAsBinaryString(this.file);
    // this.router.navigateByUrl('/manage/users/list');
  }

  //   doStuff(){
  //     //doing stuff with unsubscribe at end to only run once
  //     this.failedRequestSub.unsubscribe();
  // }

}
