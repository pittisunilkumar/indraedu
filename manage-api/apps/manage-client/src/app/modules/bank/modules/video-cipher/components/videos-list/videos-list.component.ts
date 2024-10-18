import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { VdoCipherVideoInterface } from '@application/api-interfaces';
import { HelperService } from '@application/ui';

@Component({
  selector: 'application-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosListComponent implements OnInit {

  @Input() list: VdoCipherVideoInterface[];

  constructor(
    public helper: HelperService,
  ) { }

  ngOnInit(): void {
  }


}
