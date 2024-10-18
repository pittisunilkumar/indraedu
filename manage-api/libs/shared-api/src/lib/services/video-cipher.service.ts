import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios'
import { Observable } from 'rxjs';

@Injectable()
export class VideoCipherService {

  constructor(private httpService: HttpService) {}

  findAll(query): Observable<AxiosResponse<any>> {
    console.log({ query });

    return this.httpService.get(`https://dev.vdocipher.com/api/videos?page=${query.page}&limit=${query.limit}&tags=${query.tags}`);
  }

}
