import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  default as localForage,
  getAllDataFromLocalForage,
} from 'ngrx-store-persist';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

getAllDataFromLocalForage({
  driver: localForage.INDEXEDDB,
  keys: [
    'user',
    'course',
    'subject',
    'chapter',
  ],
}).then(() => {
  
  platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
      window['ngRef'].destroy();
    }
    window['ngRef'] = ref;
      
  }).catch(err => console.log(err));

});

if (environment.production) {
  enableProdMode();
}
