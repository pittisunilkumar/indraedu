
  import { QBankInterface, SubmitUserQBankTopicInterface, SubmitUserTestInterface, EntityStatusEnum } from '@application/api-interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonFunctions {
  
    static getISTTime(date) {
      if(date){
        let d = new Date(date)
        d.getTime() + ( 5.5 * 60 * 60 * 1000 ) 
        return new Date(d.getTime() + ( 5.5 * 60 * 60 * 1000 ) )
      }else{
        return date
      }

  }
  static async SendMessage(workingkey,senderId, mobile, message) {
     var url =  'https://alerts.prioritysms.com/api/web2sms.php?workingkey=' +workingkey +'&sender=' +senderId +'&to=' +mobile +'&message=' +message
    return await this.getScript(url)
  }
  
  static getScript = (url) => {
    return new Promise((resolve, reject) => {
      const http = require('http'),
        https = require('https');

      let client = http;

      if (url.toString().indexOf("https") === 0) {
        client = https;
      }

      client.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data);
        });

      }).on("error", (err) => {
        reject(err);
      });
    });
  }
}
