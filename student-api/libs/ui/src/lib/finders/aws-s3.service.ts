// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import aws, { S3 } from 'aws-sdk';
import { environment } from '../config';

@Injectable()
export class AWSS3Service {

  bucketName = '';

  constructor() {
    this.setConfig();
  }

  setConfig() {
    return aws.config.update({
      accessKeyId: environment.AWS_ACCESS_KEY_ID,
      secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
      region: 'ap-south-1',
    });
  }

  uploadFile(payload, request, imgname) {

    this.bucketName = environment.AWS_S3_BUCKET_TESTING;

    let urlKey = '';
    const promiseArray = [];

      var name = request.user.uuid;
      if(!name){
        name = imgname;
      }
      urlKey = `uploads/plato_base/${name}.jpg`;
      var contenttype = payload.mimetype;
      const upload = new aws.S3.ManagedUpload({
        params: {
          Bucket: this.bucketName,
          Key: urlKey,
          Body: payload.buffer,
          ACL: 'public-read',
          ContentType: contenttype
        },
      });
      // console.log({ upload });

      promiseArray.push(upload.promise());

    return Promise.all(promiseArray);
  }

  
  uploadFileTicket(payload, request) {

    this.bucketName = environment.AWS_S3_BUCKET_TESTING;

    // let urlKey = '';
    const promiseArray = [];

    payload.forEach(file => {
        var extension   = (file.originalname);
        var output = extension.split(/[. ]+/).pop();
        let timestamp = Date.now()
        var urlKey = `uploads/plato_base/tickets/ticket_${timestamp}.${output}`;
        var contenttype = file.mimetype;
        const upload = new aws.S3.ManagedUpload({
          params: {
            Bucket: this.bucketName,
            Key: urlKey,
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: contenttype
          },
        });
      promiseArray.push(upload.promise());
    });

      return Promise.all(promiseArray);
  }
  deleteFile(payload) {
    const urlKey = `uploads/plato_base/${payload[0].name}`;
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

            // console.log({ prefix });
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
          // console.log(data);

          return data.Contents.map(function (file) {
            const fileKey = file.Key;
            const fileUrl = bucketUrl + encodeURIComponent(fileKey);
            // console.log({ fileKey }, { fileUrl });
            fileKeys.push(fileKey);

            return fileKeys;
          });
        }
      }
    );
  }
}
