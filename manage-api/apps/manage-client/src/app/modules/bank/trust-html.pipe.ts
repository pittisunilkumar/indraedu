import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'trustHtml'
})
export class BankTrustHtmlPipe implements PipeTransform {
  constructor(readonly sr: DomSanitizer) { }

  transform(html: string): SafeHtml {
    return this.sr.bypassSecurityTrustHtml(html);
  }
}