import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserMessageInterface } from '@application/api-interfaces';

@Component({
  selector: 'application-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.less']
})
export class MessagesListComponent implements OnInit, OnChanges {

  @Input() messages: UserMessageInterface[];

  filteredList: UserMessageInterface[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.messages = this.filteredList = changes?.messages?.currentValue;
  }

  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue) {
      this.filteredList = this.messages.filter((question) => {
        return question.name.toLowerCase().includes(filterValue);
      });
    } else {
      this.filteredList = this.messages;
    }
  }

}
