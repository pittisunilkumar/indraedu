import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'application-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() errors: { field: string; details: string[]}[]

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {

    if(changes?.errors?.currentValue) {
      this.errors = changes.errors.currentValue;
     // setTimeout(function(){ window.location.reload() }, 2000);
    }

  }

  ngOnDestroy() {
  }

}
