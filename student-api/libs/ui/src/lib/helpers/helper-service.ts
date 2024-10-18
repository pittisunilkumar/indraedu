import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  formatDate(date: string) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleString();
  }

  enumtoArray(type: any) {
    return {
      type,
      data: Object.keys(type).filter((k) => k),
    };
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.uuid === c2.uuid : c1 === c2;
  }

  userAccess() {

    const type = localStorage.getItem('currentUserType');

    return type === 'ADMIN' || type === 'SUPER';

  }

  generateMonths() {

    const months = [];

    for(let i=1; i<=60; i++) {
      months.push({ name: `${i} month(s)`, value: i });
    }

    return months;

  }

  stringSanitizer(string: string) {

    return string.trim().replace(/[^a-zA-Z0-9]/g, "");

  }

  vdoCipherEpochToDate(utcSeconds: number) {

    // here 0 is the key, which sets the date to the epoch
    const d = new Date(0);
    const seconds = d.setUTCSeconds(utcSeconds);
    return new Date(seconds).toLocaleString();

  }

  convertSecondsToDuration(seconds: number) {

    return new Date(seconds * 1000).toISOString().substr(11, 8);

  }

}
