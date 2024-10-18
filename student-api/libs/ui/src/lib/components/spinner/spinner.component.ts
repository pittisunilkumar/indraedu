import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'application-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {


  constructor(
  ) {
  }

  ngOnInit(): void {
  }


}
