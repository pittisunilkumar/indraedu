import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BannerInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';
import { environment } from '../config';

@Injectable()
export class BannersRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addBanner(banner: BannerInterface): Observable<any> {
    return this.http.post(this.baseUrl + `banners`, banner);
  }

  getAllBanners(): Observable<any> {
    return this.http.get(this.baseUrl + 'banners');
  }

  getBannerByUuid(uuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `banners/${uuid}`);
  }

  deleteBannerByUuid(bannerUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `banners/${bannerUuid}`);
  }

  editBannerByUuid(banner: BannerInterface): Observable<any> {
    return this.http.put(this.baseUrl + `banners/${banner.uuid}`, banner);
  }

  getDashboardCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'banners/dashboard/count');
  }

}
