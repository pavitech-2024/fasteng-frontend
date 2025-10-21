import { AsphaltMaterial } from '@/interfaces/asphalt';

export interface AsphaltGranulometryData {
  generalData?: any;
  step1Data?: any;
  step2Data?: any;
  results?: any;
}

export interface SpecifyMassData {
  generalData?: any;
  results?: any;
}

export interface ShapeIndexData {
  generalData?: any;
  results?: any;
}

export interface ElongatedParticlesData {
  generalData?: any;
  results?: any;
}

export interface AdhesivenessData {
  generalData?: any;
  results?: any;
}

export interface AbrasionData {
  generalData?: any;
  results?: any;
}

export interface SandEquivalentData {
  generalData?: any;
  results?: any;
}

export interface AngularityData {
  generalData?: any;
  results?: any;
}

export interface ViscosityRotationalData {
  generalData?: any;
  results?: any;
}

export interface PenetrationData {
  generalData?: any;
  results?: any;
}

export interface SofteningPointData {
  generalData?: any;
  results?: any;
}

export interface FlashPointData {
  generalData?: any;
  results?: any;
}

export interface DuctilityData {
  generalData?: any;
  results?: any;
}

export interface RtfoData {
  generalData?: any;
  results?: any;
}

export interface ElasticRecoveryData {
  generalData?: any;
  results?: any;
}

// Interface para o ensaio de granulometria (específica)
export interface GranulometryEssay {
  _id: string;
  generalData: {
    name: string;
    material: {
      name: string;
      type: string;
    };
    createdAt: string;
    operator?: string;
    calculist?: string;
  };
  step2Data: {
    material_mass: number;
    table_data: { sieve_label: string; sieve_value: number; passant: number; retained: number }[];
    bottom: number;
  };
  results: {
    accumulated_retained: [string, number][];
    graph_data: [number, number][];
    passant: [string, number][];
    retained_porcentage: [string, number][];
    total_retained: number;
    nominal_diameter: number;
    nominal_size: number;
    fineness_module: number;
    cc: number;
    cnu: number;
    error: number;
  };
}

export interface EssaysData {
  asphaltGranulometryData?: AsphaltGranulometryData;
  specifyMassData?: SpecifyMassData;
  shapeIndexData?: ShapeIndexData;
  elongatedParticlesData?: ElongatedParticlesData;
  adhesivenessData?: AdhesivenessData;
  losAngelesAbrasionData?: AbrasionData;
  sandEquivalentData?: SandEquivalentData;
  angularityData?: AngularityData;
  viscosityRotationalData?: ViscosityRotationalData;
  penetrationData?: PenetrationData;
  softeningPointData?: SofteningPointData;
  flashPointData?: FlashPointData;
  ductilityData?: DuctilityData;
  rtfoData?: RtfoData;
  elasticRecoveryData?: ElasticRecoveryData;
}

export interface IEssaysData {
  essayName: string;
  data: EssaysData;
}

export interface MaterialData {
  material: AsphaltMaterial;
  essays: IEssaysData[];
}

export interface MaterialState {
  granulometryData?: AsphaltGranulometryData;
  specificMassData?: SpecifyMassData;
  shapeIndexData?: ShapeIndexData;
  elongatedParticlesData?: ElongatedParticlesData;
  adhesivenessData?: AdhesivenessData;
  losAngelesAbrasionData?: AbrasionData;
  sandEquivalentData?: SandEquivalentData;
  angularityData?: AngularityData;
  viscosityRotationalData?: ViscosityRotationalData;
  penetrationData?: PenetrationData;
  softeningPointData?: SofteningPointData;
  flashPointData?: FlashPointData;
  ductilityData?: DuctilityData;
  rtfoData?: RtfoData;
  elasticRecoveryData?: ElasticRecoveryData;
}