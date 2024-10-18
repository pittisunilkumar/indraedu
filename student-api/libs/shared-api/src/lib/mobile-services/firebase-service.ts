import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private instances: Map<string, admin.app.App> = new Map();

  getInstance(instanceName: string): admin.app.App {
    if (!this.instances.has(instanceName)) {
      const serviceAccount = require(`../../../../../config/${instanceName}-firebase.json`);
      
      const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${instanceName}.firebaseio.com`
      }, instanceName);
      this.instances.set(instanceName, firebaseApp);
    }
    return this.instances.get(instanceName);
  }
}