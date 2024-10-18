import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface LoaderInterface {
  show: boolean;
  user?: any;
}

@Injectable()
export class LoaderService {

  private loaderSubject = new Subject<LoaderInterface>();

  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  show() {
    this.loaderSubject.next(<LoaderInterface>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<LoaderInterface>{ show: false });
  }

  setUser(user) {
    this.loaderSubject.next(<LoaderInterface>{ user: user })
  }

  getData() {
    return this.loaderSubject;
  }

}