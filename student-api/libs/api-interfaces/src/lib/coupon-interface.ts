import { FlagsInterface, UserKeyInterface } from '@application/api-interfaces';

export interface CouponInterface {
  uuid: string;
  code: string;
  discountType:string;
  discount: number;
  totalCoupons:number;
  availableCoupons: number;
  valiedFrom: Date;
  valiedTo: Date;
  subscription: any,
	couponType: string,
  users:any;
  agent:any;
  agentCommission:number;
  agentAmount:number;
  readonly createdOn: Date;
  modifiedOn?: Date;
  createdBy: UserKeyInterface;
  modifiedBy?: UserKeyInterface;
  flags: CouponFlagsInterface;
  availedBy?: AvailedByInterface[];
}

export interface CouponFlagsInterface extends FlagsInterface {
  affiliate: boolean;
}

export interface AvailedByInterface extends UserKeyInterface {
  availedDate: Date;
}