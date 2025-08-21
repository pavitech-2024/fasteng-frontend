import { DduiData } from '@/stores/asphalt/ddui/ddui.store';
import { FwdData } from '@/stores/asphalt/fwd/fwd.store';
import { IggData } from '@/stores/asphalt/igg/igg.store';
import { RtcdData } from '@/stores/asphalt/rtcd/rtcd.store';
import { Sieve } from '../common';

export enum AsphaltMaterialTypesEnum {
  COARSE_AGGREGATE = 'coarseAggregate',
  FINE_AGGREGATE = 'fineAggregate',
  ASPHALT_BINDER = 'asphaltBinder',
  CAP = 'CAP',
  FILLER = 'filler',
  OTHER = 'other',
}

export type AsphaltMaterialTypes =
  | AsphaltMaterialTypesEnum.COARSE_AGGREGATE
  | AsphaltMaterialTypesEnum.FINE_AGGREGATE
  | AsphaltMaterialTypesEnum.ASPHALT_BINDER
  | AsphaltMaterialTypesEnum.CAP
  | AsphaltMaterialTypesEnum.FILLER
  | AsphaltMaterialTypesEnum.OTHER;

export type AsphaltMaterialData = {
  name: string;
  type: AsphaltMaterialTypes | '';
  description?: {
    source?: string;
    responsible?: string;
    maxDiammeter?: Sieve | {label: ''; value: 0};
    aggregateNature?: string;
    boughtDate?: string;
    recieveDate?: string;
    extractionDate?: string;
    collectionDate?: string;
    classification_CAP?: 'CAP 30/45' | 'CAP 50/70' | 'CAP 85/100' | 'CAP 150/200' | ''; // for CAP
    classification_AMP?: 'AMP 50/65' | 'AMP 55/75' | 'AMP 60/85' | 'AMP 65/90' | ''; // for AMP
    observation?: string;
  };
};

export class AsphaltMaterial {
  _id: string;
  name: string;
  type: AsphaltMaterialTypes;
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
    observation?: string;
  };
}

export type Materials = {
  materials: AsphaltMaterial[] | AsphaltMaterial[][];
  dduiEssays: DduiData[];
  fwdEssays: FwdData[];
  iggEssays: IggData[];
  rtcdEssays: RtcdData[];
};
