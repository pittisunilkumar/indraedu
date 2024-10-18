import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrganizationInterface } from '@application/api-interfaces';

@Component({
  selector: 'application-org-details-dialog',
  templateUrl: './org-details-dialog.component.html',
  styleUrls: ['./org-details-dialog.component.less'],
})
export class OrgDetailsDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: OrganizationInterface) {}

  ngOnInit(): void {}
}
