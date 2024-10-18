import { Component, Input, OnInit } from '@angular/core';
import { TestInterface } from '@application/api-interfaces';

@Component({
  selector: 'application-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.less']
})
export class TestPreviewComponent implements OnInit {

  @Input() test: TestInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
