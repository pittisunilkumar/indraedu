import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatSnackBarDefaultData } from '../../services/notification.service';

@Component({
  selector: 'application-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.less']
})
export class ToastMessageComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: MatSnackBarDefaultData
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    
  }

}
