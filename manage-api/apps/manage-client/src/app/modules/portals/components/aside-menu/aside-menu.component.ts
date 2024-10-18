import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'application-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.less']
})
export class PortalAsideMenuComponent implements OnInit {

  isVisible = localStorage.currentUserType !== 'DATAENTRY';

  constructor() { }

  ngOnInit(): void {
  }

}
