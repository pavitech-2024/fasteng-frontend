import { Sieve } from '../common';

export type ConcreteMaterialTypes = 'fineAggregate' | 'coarseAggregate' | 'cement';

export type ConcreteMaterialData = {
  name: string;
  type: ConcreteMaterialTypes;
  description?: {
    source?: string;
    responsible?: string;
    maxDiammeter?: Sieve;
    aggregateNature?: string;
    boughtDate?: string;
    recieveDate?: string;
    extractionDate?: string;
    collectionDate?: string;
    classification_CAP?: 'CAP 30/45' | 'CAP 50/70' | 'CAP 85/100' | 'CAP 150/200'; // for CAP
    classification_AMP?: 'AMP 50/65' | 'AMP 55/75' | 'AMP 60/85' | 'AMP 65/90'; // for AMP
    resistance?: string;
    observation?: string;
  };
};

export class ConcreteMaterial {
  _id: string;
  name: string;
  type: ConcreteMaterialTypes;
  createdAt: Date;
  userId: string;
  description: {
    source?: string;
    responsible?: string;
    maxDiammeter?: Sieve;
    aggregateNature?: string;
    boughtDate?: string;
    recieveDate?: string;
    extractionDate?: string;
    collectionDate?: string;
    classification_CAP?: 'CAP 30/45' | 'CAP 50/70' | 'CAP 85/100' | 'CAP 150/200'; // for CAP
    classification_AMP?: 'AMP 50/65' | 'AMP 55/75' | 'AMP 60/85' | 'AMP 65/90'; // for AMP
    resistance?: string;
    observation?: string;
  };
}
