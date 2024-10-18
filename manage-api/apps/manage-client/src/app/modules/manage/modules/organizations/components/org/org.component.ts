import { Component, Input, OnInit } from '@angular/core';
import { OrganizationInterface } from '@application/api-interfaces';

@Component({
  selector: 'application-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.less'],
})
export class OrgComponent implements OnInit {
  @Input() org: any;

  constructor() {}

  ngOnInit(): void {}

  getEntitlements(): string[] {
    if (!this.org?.entitlements) {
      return;
    }

    const vals = Object.values(this.org.entitlements);
    const keys = Object.keys(this.org.entitlements);
    const entitlements = [];

    vals.map((v, index) => {
      if (v) {
        entitlements.push(keys[index]);
      }
    });

    return entitlements;
  }
}
