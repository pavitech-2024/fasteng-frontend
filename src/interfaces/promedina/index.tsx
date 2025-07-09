export type PromedinaDataFilter = {
  _id: string;
  generalData: {
    name: string;
    layer: string;
    cityState: string;
    zone: string;
    highway: string;
  };
  updatedAt?: string;   
  createdAt?: string;   
};