import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[controlErrorContainer]'
})
export class FormControlErrorContainerDirective {

  constructor(public vcr: ViewContainerRef) { }

}