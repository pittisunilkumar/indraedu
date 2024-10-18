import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CouponInterface } from '@application/api-interfaces';
import { Observable } from 'rxjs';

@Injectable()
export class CouponsRepositoryService {

  baseUrl = '';

  constructor(
    private http: HttpClient,
    @Inject('environment') private env,
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  addCoupons(coupons: CouponInterface): Observable<any> {
    return this.http.post(this.baseUrl + `coupons`, coupons);
  }

  getTesting(): Observable<any> {
    return this.http.get(this.baseUrl + `sample`);
  }
  addTitle(inputBody): Observable<any> {
    return this.http.post(this.baseUrl + `sample`, inputBody);
  }
  getAllCoupons(): Observable<any> {
    return this.http.get(this.baseUrl + 'coupons');
  }

  getCouponsByUuid(couponsUuid: string): Observable<any> {
    return this.http.get(this.baseUrl + `coupons/${couponsUuid}`);
  }
  getCouponsByAgentId(agentId: string): Observable<any> {
    return this.http.get(this.baseUrl + `coupons/getCouponsByAgentId/${agentId}`);
  }
 

  deleteCouponsByUuid(couponsUuid: string): Observable<any> {
    return this.http.delete(this.baseUrl + `coupons/${couponsUuid}`);
  }

  editCouponsByUuid(coupons: CouponInterface): Observable<any> {
    return this.http.put(this.baseUrl + `coupons/${coupons.uuid}`, coupons);
  }
}
