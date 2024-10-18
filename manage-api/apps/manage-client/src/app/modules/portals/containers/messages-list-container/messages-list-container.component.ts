import { Component, OnInit } from '@angular/core';
import { PortalRepositoryService } from '@application/ui';

@Component({
  selector: 'application-messages-list-container',
  templateUrl: './messages-list-container.component.html',
  styleUrls: ['./messages-list-container.component.less']
})
export class MessagesListContainerComponent implements OnInit {

  messages$ = this.portalRepo.getUserMessages();

  constructor(
    private portalRepo: PortalRepositoryService,
  ) { }

  ngOnInit(): void {
  }

}
