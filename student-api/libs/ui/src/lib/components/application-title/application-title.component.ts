import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from '@application/api-interfaces';
import * as config from '../../config';
import { HelperService } from '../../helpers/helper-service';
import { AuthService } from '../../services';

@Component({
  selector: 'application-title',
  templateUrl: './application-title.component.html',
  styleUrls: ['./application-title.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationTitleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() userName: string;
  // @Input() navItems: string;

  navItems = [
    { name: 'COMMON.BANKS', link: ['bank'], access: true },
    { name: 'COMMON.MANAGE', link: ['manage'], access: true },
    { name: 'COMMON.TEST_SERIES', link: ['test-series'], access: true },
    { name: 'COMMON.QBANK', link: ['q-bank'], access: true },
    { name: 'COMMON.VIDEOS', link: ['videos'], access: true },
    { name: 'COMMON.PORTALS', link: ['portal'], access: true },
  ];
  initials: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private helper: HelperService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes?.userName?.currentValue) {
      this.userName = changes?.userName?.currentValue;
      this.initials = changes?.userName?.currentValue?.replace(/[^a-zA-Z]+/g, '').substring(0,2);
    }
  }

  ngOnInit(): void {

    this.navItems.map(it => {
      if(it.link.includes('manage')) {
        return it.access = this.helper.userAccess();
      }
    });

  }

  logout() {

    this.authService.logout();
    window.location.reload();
    this.router.navigate(['/']);

  }

  ngOnDestroy() {

    this.userName = null;
  }

}
