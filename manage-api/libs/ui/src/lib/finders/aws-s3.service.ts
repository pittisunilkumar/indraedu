import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import aws, { S3 } from 'aws-sdk';
import { environment } from '../config';

@Injectable()
export class AWSS3Service {

  bucketName = '';

  constructor(private http: HttpClient) {
    this.setConfig();
  }

  setConfig() {
    return aws.config.update({

      accessKeyId:atob(environment.AWS_ACCESS_KEY_ID),
      secretAccessKey: atob(environment.AWS_SECRET_ACCESS_KEY),

      region: 'ap-south-1',
    });
  }

  uploadFile(payload, bucket?: string) {

    let ACL;

    // environment.AWS_S3_BUCKET_NAME
    switch(bucket) {

      case 'uploads': {
        this.bucketName = environment.AWS_S3_BUCKET_TESTING;
        // this.bucketName = process.env.AWS_S3_BUCKET_TESTING;
        ACL = 'public-read';
        break;
      }

      case 'migration': {
        this.bucketName = environment.AWS_S3_BUCKET_MIGRATION;
        // this.bucketName = process.env.AWS_S3_BUCKET_MIGRATION;
        ACL = 'public-read';
        break;
      }

    }

    let urlKey = '';
    const promiseArray = [];

    if(payload.length > 1) {
      for(let i = 0; i < payload.length; i++){
        urlKey = `uploads/${payload[i].name}`;
        var contenttype = payload[i].type;
        const upload = new aws.S3.ManagedUpload({
          params: {
            Bucket: this.bucketName,
            Key: urlKey,
            Body: payload[i],
            ACL: 'public-read',
            ContentType: contenttype
          },
        });
        console.log({ upload });

        promiseArray.push(upload.promise());
      }

    } else {
      urlKey = `uploads/${payload[0].name}`;
      console.log(payload[0]);
      
      var contenttype = payload[0].type;
      const upload = new aws.S3.ManagedUpload({
        params: {
          Bucket: this.bucketName,
          Key: urlKey,
          Body: payload[0],
          ACL: 'public-read',
          ContentType: contenttype
        },
      });
      console.log({ upload });

      promiseArray.push(upload.promise());

    }

    return Promise.all(promiseArray);
  }

  deleteFile(payload) {
    const urlKey = `uploads/${payload[0].name}`;
    const params = {
      Bucket: this.bucketName,
      Key: urlKey,
    };
    const result = new aws.S3().deleteObject(params, (err, data) => {
      if (data) {
        return data;
      } else {
        return err;
      }
    });

    console.log({ result });
  }

  listAlbums() {
    const s3 = new aws.S3();
    const albums = [];
    return s3.listObjects(
      { Bucket: this.bucketName, Delimiter: '/' },
      (err, data) => {
        if (err) {
          return alert(
            'There was an error listing your albums: ' + err.message
          );
        } else {
          return data.CommonPrefixes.map(function (commonPrefix) {
            const prefix = commonPrefix.Prefix;
            const albumName = decodeURIComponent(prefix.replace('/', ''));

            console.log({ prefix });
            albums.push(prefix);
            return albums;
          });
        }
      }
    );
  }

  viewAlbum(albumName) {
    const s3 = new aws.S3();
    const fileKeys = [];
    const albumPhotosKey = encodeURIComponent(albumName) + '/';
    return s3.listObjects(
      { Bucket: this.bucketName, Prefix: albumPhotosKey },
      (err, data) => {
        if (err) {
          return alert('There was an error viewing your album: ' + err.message);
        } else {
          // 'this' references the AWS.Response instance that represents the response
          const href = new aws.Response(); // .request.httpRequest.endpoint.href();

          const bucketUrl = this.bucketName + '/';
          console.log(data);

          return data.Contents.map(function (file) {
            const fileKey = file.Key;
            const fileUrl = bucketUrl + encodeURIComponent(fileKey);
            console.log({ fileKey }, { fileUrl });
            fileKeys.push(fileKey);

            return fileKeys;
          });
        }
      }
    );
  }
}
