export interface VdoCipherVideoListInterface {
  count: number;
  rows: VdoCipherVideoInterface[];
}

export interface VdoCipherVideoInterface {
  length:	number;
  public:	boolean;
  upload_time: number;
  reso:	number[];
  mobileReso:	number[];
  status: string;
  title: string;
  thumbUrl:	string;
  id: string;
  description: string;
  poster: string;
  posters: { width: number; height: number; posterUrl: string; }[]
}
