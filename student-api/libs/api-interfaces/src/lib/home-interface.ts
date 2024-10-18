import { BannerInterface } from './banner-interface';

export interface HomePageDataInterface {
  status: boolean;
  code: number;
  message: string;
  data: Data;
}
export interface Data {
  banners: any;
  mcqOfTheDay: any;
  quotation: string;
  suggested: any;
  plans:any
}