export type SampleData = {
  name: string;
  type: SampleTypes;
  description?: {
    construction?: string;
    snippet?: string;
    provenance?: string;
    stake?: string;
    layer?: string;
    depth?: number; //cm
    exd?: string;
    collectionDate?: string;
    observation?: string;
  };
};
export class Sample {
  _id: string;
  name: string;
  type: SampleTypes;
  createdAt: Date;
  userId: string;
  description: {
    construction?: string;
    snippet?: string;
    provenance?: string;
    stake?: string;
    layer?: string;
    depth?: number; //cm
    exd?: string;
    collectionDate: string;
    observation?: string;
  };
}

export type SampleTypes = 'inorganicSoil' | 'organicSoil' | 'pavementLayer';
