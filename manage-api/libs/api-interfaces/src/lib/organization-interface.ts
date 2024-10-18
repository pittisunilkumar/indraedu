import { KeyInterface } from './api-interfaces';
import { UserKeyInterface } from './user-interface';

export interface OrganizationInterface {
  uuid: string;
  title: string;
  // type: string;
  // entitlements: OrganizationEntitlementsInterface;
  address: AddressInterface;
  // phone: number;
  mobile: number;
  email: string;
  firebase:string;
  // branches: BranchInterface[];
  // subscriptions: KeyInterface[];
  // courses: KeyInterface[];
  // users: UserKeyInterface[];
  // imgUrl: string;
  readonly createdOn: Date;
  readonly modifiedOn: Date;
  createdBy?:any;
  readonly flags: any;
}

export interface OrganizationEntitlementsInterface {
  videoBank: boolean;
  questionBank: boolean;
  testBank: boolean;
  mcq: boolean;
  spartan: boolean;
  materials: boolean;
  flashCards: boolean;
}

export interface OrganizationFlagsInterface {
  onTrail: boolean;
  active: boolean;
  trailPeriod: number;
}

export interface AddressInterface {
  addressLine1: string;
  addressLine2: string;
  state: string;
  town: string;
  pincode: number;
}

export interface BranchInterface {
  uuid: string;
  title: string;
  address: AddressInterface;
}
