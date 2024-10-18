import { ComponentFactoryResolver, ComponentRef, Directive, Host, Inject, Input, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { ControlContainer, NgControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { EMPTY, merge, Observable } from 'rxjs';
import { FormFieldErrorComponent } from '../../components';
import { FormControlErrorContainerDirective } from '../form-error-container/form-error-container.directive';
import { FormSubmitDirective } from '../form-submit/form-submit.directive';
import { ERROR_LIST } from './error-list';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[formControl] [formControlName]'
})
export class FormErrorDirective implements OnInit {

  ref: ComponentRef<FormFieldErrorComponent>;
  container: ViewContainerRef;
  submit$: Observable<Event>;
  @Input() customErrors = {};

  constructor(
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Optional() controlErrorContainer: FormControlErrorContainerDirective,
    @Inject(ERROR_LIST) private errors,
    @Optional() @Host() private form: FormSubmitDirective,
    private controlDir: NgControl
  ) {

    this.container = controlErrorContainer ? controlErrorContainer.vcr : vcr;
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    
  }

  ngOnInit() {
    merge(
      this.submit$,
      this.control.valueChanges
    ).pipe(
      untilDestroyed(this))
    .subscribe((v) => {
      const controlErrors = this.control.errors;
      if (controlErrors) {
        console.log('directu=ive', {controlErrors});
        
        const firstKey = Object.keys(controlErrors)[0];
        const getError = this.errors[firstKey];
        const text = this.customErrors[firstKey] || getError(controlErrors[firstKey]);
        this.setError(text);
      } else if (this.ref) {
        this.setError(null);
      }
    })
  }

  get control() {
    return this.controlDir.control;
  }

  setError(text: string) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(FormFieldErrorComponent);
      this.ref = this.container.createComponent(factory);
    }

    this.ref.instance.text = text;
  }

}
