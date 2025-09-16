import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type GmmRows = {
  id: number;
  insert: boolean;
  value: number;
};

interface MarhsallGeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  objective: 'bearing' | 'bonding';
  dnitBand: 'A' | 'B' | 'C';
  description?: string;
  step: number;
}

interface MarshallMaterialSelectionData {
  aggregates: { _id: string; name: string }[];
  binder: { _id: string, name: string};
}

interface MarshallGranulometryCompositionData {
  table_data: {
    table_rows: {
      sieve_label: string;
      [key: string]:
        | string
        | {
            _id: string;
            total_passant: string;
            passant: string;
          };
    }[];
    table_column_headers: string[];
  };
  percentageInputs: { [key: string]: number }[];
  sumOfPercents: number[];
  dnitBands: { higher: [string, number][]; lower: [string, number][] };
  bands: { higherBand: [number]; lowerBand: [number]; letter };
  pointsOfCurve: any[];
  percentsOfMaterials: any[];
  graphData: any[];
  projections: any[];
}

interface MarshallBinderTrialData {
  trial: number;
  percentsOfDosage: any[];
  newPercentOfDosage: number[];
  bandsOfTemperatures: {
    machiningTemperatureRange: {
      higher: number;
      average: number;
      lower: number;
    };
    compressionTemperatureRange: {
      higher: number;
      average: number;
      lower: number;
    };
    AggregateTemperatureRange: {
      higher: number;
      average: number;
      lower: number;
    };
  };
}

interface MarshallMaximumMixtureDensityData {
  method: string;
  dmt: {
    [key: string]: number;
  }[];
  gmm: GmmRows[];
  temperatureOfWater: number;
  missingSpecificMass: {
    name: string;
    _id: string;
    value: number;
  }[];
  maxSpecificGravity: {
    result: {
      lessOne: number;
      lessHalf: number;
      normal: number;
      plusHalf: number;
      plusOne: number;
    };
    method: string;
  };
  riceTest: {
    id: number;
    teor: number;
    massOfDrySample: number;
    massOfContainerWaterSample: number;
    massOfContainerWater: number;
  }[];
  listOfSpecificGravities: any[];
}

interface VolumetricParametersData {
  lessOne: {
    id: number;
    diammeter: number;
    height: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    stability: number;
    fluency: number;
    diametricalCompressionStrength: number;
  }[];
  lessHalf: {
    id: number;
    diammeter: number;
    height: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    stability: number;
    fluency: number;
    diametricalCompressionStrength: number;
  }[];
  normal: {
    id: number;
    diammeter: number;
    height: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    stability: number;
    fluency: number;
    diametricalCompressionStrength: number;
  }[];
  plusHalf: {
    id: number;
    diammeter: number;
    height: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    stability: number;
    fluency: number;
    diametricalCompressionStrength: number;
  }[];
  plusOne: {
    id: number;
    diammeter: number;
    height: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    stability: number;
    fluency: number;
    diametricalCompressionStrength: number;
  }[];
  volumetricParameters: {
    pointsOfCurveDosageRBV: any[];
    pointsOfCurveDosageVv: any[];
    volumetricParameters: any[];
  };
}

interface OptimumBinderContentData {
  expectedParameters: {
    expectedParameters: {
      Gmb: number;
      RBV: number;
      Vam: number;
      Vv: number;
      newMaxSpecificGravity: number;
    };
  };
  graphics: {
    rbv: string[][];
    vv: string[][];
    sg: string[][];
    gmb: string[][];
    stability: string[][];
    vam: string[][];
  };
  optimumBinder: {
    optimumContent: number;
    pointsOfCurveDosage: any[];
    confirmedPercentsOfDosage: number[];
    curveRBV: any[];
    curveVv: any[];
  };
}

interface ConfirmationCompressionData {
  dmt: boolean;
  gmm: boolean;
  gmmInput: string;
  temperatureOfWater: number;
  confirmedSpecificGravity: {
    result: number;
    type: string;
  };
  optimumBinder: {
    id: number;
    diammeter: number;
    height: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    stability: number;
    fluency: number;
    diametricalCompressionStrength: number;
  }[];
  riceTest: {
    teor: string;
    massOfDrySample: number;
    massOfContainerWaterSample: number;
    massOfContainerWater: number;
  };
  confirmedVolumetricParameters: {
    valuesOfVolumetricParameters: any;
    asphaltContent: number;
    quantitative: any;
    values: {
      volumeVoids: number;
      apparentBulkSpecificGravity: number;
      voidsFilledAsphalt: number;
      aggregateVolumeVoids: number;
      ratioBitumenVoid: number;
      stability: number;
      fluency: number;
      indirectTensileStrength: number;
    };
  };
}

export type MarshallData = {
  _id?: string;
  generalData: MarhsallGeneralData;
  materialSelectionData: MarshallMaterialSelectionData;
  granulometryCompositionData: MarshallGranulometryCompositionData;
  binderTrialData: MarshallBinderTrialData;
  maximumMixtureDensityData: MarshallMaximumMixtureDensityData;
  volumetricParametersData: VolumetricParametersData;
  optimumBinderContentData: OptimumBinderContentData;
  confirmationCompressionData: ConfirmationCompressionData;
  createdAt: Date;
  updatedAt: Date;
};

export type MarshallActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: () => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = {
  0: 'generalData',
  1: 'materialSelectionData',
  2: 'granulometryCompositionData',
  3: 'binderTrialData',
  4: 'maximumMixtureDensityData',
  5: 'volumetricParametersData',
  6: 'optimumBinderContentData',
  7: 'confirmationCompressionData',
};

const initialState = {
  generalData: {
    userId: null,
    name: null,
    laboratory: null,
    operator: null,
    calculist: null,
    objective: null,
    dnitBand: null,
    description: null,
    step: 0,
  },
  materialSelectionData: {
    aggregates: [],
    binder: null,
  },
  granulometryCompositionData: {
    table_data: null,
    percentageInputs: [],
    bands: null,
    dnitBands: {
      higher: null,
      lower: null,
      letter: null,
    },
    pointsOfCurve: [],
    sumOfPercents: [],
    percentsOfMaterials: [],
    graphData: [],
    projections: [],
  },
  binderTrialData: {
    trial: null,
    percentsOfDosage: [],
    newPercentOfDosage: [],
    bandsOfTemperatures: {
      machiningTemperatureRange: {
        higher: null,
        average: null,
        lower: null,
      },
      compressionTemperatureRange: {
        higher: null,
        average: null,
        lower: null,
      },
      AggregateTemperatureRange: {
        higher: null,
        average: null,
        lower: null,
      },
    },
  },
  maximumMixtureDensityData: {
    method: null,
    dmt: [],
    gmm: [
      {
        id: 1,
        insert: true,
        value: null,
      },
      {
        id: 2,
        insert: true,
        value: null,
      },
      {
        id: 3,
        insert: true,
        value: null,
      },
      {
        id: 4,
        insert: true,
        value: null,
      },
      {
        id: 5,
        insert: true,
        value: null,
      },
    ],
    missingSpecificMass: [],
    temperatureOfWater: null,
    maxSpecificGravity: {
      result: {
        lessOne: null,
        lessHalf: null,
        normal: null,
        plusHalf: null,
        plusOne: null,
      },
      method: null,
    },
    riceTest: [
      {
        id: 1,
        teor: null,
        massOfDrySample: null,
        massOfContainerWaterSample: null,
        massOfContainerWater: null,
      },
      {
        id: 2,
        teor: null,
        massOfDrySample: null,
        massOfContainerWaterSample: null,
        massOfContainerWater: null,
      },
      {
        id: 3,
        teor: null,
        massOfDrySample: null,
        massOfContainerWaterSample: null,
        massOfContainerWater: null,
      },
      {
        id: 4,
        teor: null,
        massOfDrySample: null,
        massOfContainerWaterSample: null,
        massOfContainerWater: null,
      },
      {
        id: 5,
        teor: null,
        massOfDrySample: null,
        massOfContainerWaterSample: null,
        massOfContainerWater: null,
      },
    ],
    listOfSpecificGravities: [],
  },
  volumetricParametersData: {
    lessOne: [
      {
        id: 0,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ],
    lessHalf: [
      {
        id: 0,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ],
    normal: [
      {
        id: 0,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ],
    plusHalf: [
      {
        id: 0,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ],
    plusOne: [
      {
        id: 0,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ],
    volumetricParameters: {
      pointsOfCurveDosageRBV: [],
      pointsOfCurveDosageVv: [],
      volumetricParameters: [],
    },
  },
  optimumBinderContentData: {
    expectedParameters: {
      expectedParameters: {
        Gmb: null,
        RBV: null,
        Vam: null,
        Vv: null,
        newMaxSpecificGravity: null,
      },
    },
    graphics: {
      rbv: [],
      vv: [],
      sg: [],
      gmb: [],
      stability: [],
      vam: [],
    },
    optimumBinder: {
      optimumContent: null,
      pointsOfCurveDosage: [],
      confirmedPercentsOfDosage: [],
      curveRBV: [],
      curveVv: [],
    },
  },
  confirmationCompressionData: {
    dmt: false,
    gmm: false,
    gmmInput: null,
    temperatureOfWater: null,
    confirmedSpecificGravity: {
      result: null,
      type: null,
    },
    optimumBinder: [
      {
        id: 0,
        diammeter: null,
        height: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        stability: null,
        fluency: null,
        diametricalCompressionStrength: null,
      },
    ],
    riceTest: {
      id: 0,
      teor: null,
      massOfDrySample: null,
      massOfContainerWaterSample: null,
      massOfContainerWater: null,
    },
    confirmedVolumetricParameters: {
      valuesOfVolumetricParameters: null,
      asphaltContent: null,
      quantitative: null,
      values: {
        volumeVoids: null,
        apparentBulkSpecificGravity: null,
        voidsFilledAsphalt: null,
        aggregateVolumeVoids: null,
        ratioBitumenVoid: null,
        stability: null,
        fluency: null,
        indirectTensileStrength: null,
      },
    },
  },
  createdAt: null,
  updatedAt: null,
};

const useMarshallStore = create<MarshallData & MarshallActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 10) {
              return value; // Substitui o estado inteiro pelo novo valor
            } else {
              if (key) {
                return {
                  ...state,
                  [stepVariant[step]]: {
                    ...state[stepVariant[step]],
                    [key]: value,
                  },
                };
              } else {
                return { ...state, [stepVariant[step]]: value };
              }
            }
          }),

        reset: () => {
          set(initialState);
        },
      }),
      {
        // name data store e config no session storage
        name: 'asphalt-marshall-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useMarshallStore;
