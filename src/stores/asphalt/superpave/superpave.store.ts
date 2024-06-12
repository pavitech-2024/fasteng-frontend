import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface SuperpaveGeneralData {
  userId: string;
  name: string;
  laboratory?: string;
  operator?: string;
  calculist?: string;
  trafficVolume: 'low' | 'medium' | 'medium-high' | 'high';
  objective: 'bearing' | 'bonding';
  dnitBand: 'A' | 'B' | 'C';
  description?: string;
  step: number;
}

interface SuperpaveMaterialSelectionData {
  aggregates: { _id: string; name: string }[]; // lista de ids dos agregados
  binder: string; // id do ligante
}

interface SuperpaveGranulometryCompositionData {
  percentageInputs: {
    material_1: string;
    material_2: string;
  }[];
  graphData: any[];
  percentsToList: any[];
  lowerComposition: {
    percentsOfMaterials: [[], []];
    sumOfPercents: [];
  };
  averageComposition: {
    percentsOfMaterials: [[], []];
    sumOfPercents: [];
  };
  higherComposition: {
    percentsOfMaterials: [[], []];
    sumOfPercents: [];
  };
  nominalSize: {
    value: number;
  };
  pointsOfCurve: number[];
  chosenCurves: {
    lower: boolean;
    average: boolean;
    higher: boolean;
  };
  bands: {
    higher: any[];
    lower: any[];
    letter: string;
  };
}

interface SuperpaveInitialBinderData {
  materials: {
    name: string;
    realSpecificMass: number;
    apparentSpecificMass: number;
    absorption: number;
  }[];
  binderSpecificMass: number;
  granulometryComposition: {
    combinedGsa: number;
    combinedGsb: number;
    gse: number;
    pli: number;
    percentsOfDosageWithBinder: number[]
  }[],
  binderInput: number;
  turnNumber: {
    initialN: number;
    maxN: number;
    projectN: number;
    tex: string;
  };
}

interface FirstCompressionData {
  inferiorRows: {
    id: number,
    diammeter: number,
    dryMass: number,
    submergedMass: number,
    drySurfaceSaturatedMass: number,
    waterTemperatureCorrection: number,
    document: string
  }[],
  intermediariaRows: {
    id: number,
    diammeter: number,
    dryMass: number,
    submergedMass: number,
    drySurfaceSaturatedMass: number,
    waterTemperatureCorrection: number,
    document: string
  }[],
  superiorRows: {
    id: number,
    diammeter: number,
    dryMass: number,
    submergedMass: number,
    drySurfaceSaturatedMass: number,
    waterTemperatureCorrection: number,
    document: string
  }[],
  spreadSheetTemplate: string,
  maximumDensity: {
    lower: {
      gmm: number,
      gmb: number
    },
    average: {
      gmm: number,
      gmb: number
    },
    higher: {
      gmm: number,
      gmb: number
    }
  },
  riceTest: {
    curve: string,
    drySampleMass: number,
    waterSampleMass: number,
    waterSampleContainerMass: number,
    gmm: number,
    temperatureOfWater: number
  }[]
}

export type SuperpaveData = {
  generalData: SuperpaveGeneralData;
  materialSelectionData: SuperpaveMaterialSelectionData;
  granulometryCompositionData: SuperpaveGranulometryCompositionData;
  initialBinderData: SuperpaveInitialBinderData;
  firstCompressionData: FirstCompressionData
};

export type SuperpaveActions = {
  setData: ({ step, key, value }: setDataType) => void;
  reset: ({ step }: setDataType) => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = {
  0: 'generalData',
  1: 'materialSelectionData',
  2: 'granulometryCompositionData',
  3: 'initialBinderData',
  4: 'firstCompressionData'
};

const initialState = {
  generalData: {
    userId: null,
    name: null,
    laboratory: null,
    operator: null,
    calculist: null,
    trafficVolume: null,
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
    graphData: [],
    lowerComposition: {
      percentsOfMaterials: null,
      sumOfPercents: null,
    },
    averageComposition: {
      percentsOfMaterials: null,
      sumOfPercents: null,
    },
    higherComposition: {
      percentsOfMaterials: null,
      sumOfPercents: null,
    },
    percentageInputs: [
      {
        material_1: null,
        material_2: null,
      },
      {
        material_1: null,
        material_2: null,
      },
      {
        material_1: null,
        material_2: null,
      },
    ],
    percentsToList: [],
    nominalSize: {
      value: null,
    },
    pointsOfCurve: [],
    chosenCurves: {
      lower: null,
      average: null,
      higher: null,
    },
    bands: {
      higher: [],
      lower: [],
      letter: null,
    },
  },
  initialBinderData: {
    materials: [{
      name: null,
      realSpecificMass: null,
      apparentSpecificMass: null,
      absorption: null,
    }],
    binderSpecificMass: null,
    granulometryComposition: [
      {
        combinedGsa: null,
        combinedGsb: null,
        gse: null,
        pli: null,
        percentsOfDosageWithBinder: []
      },
      {
        combinedGsa: null,
        combinedGsb: null,
        gse: null,
        pli: null,
        percentsOfDosageWithBinder: []
      },
      {
        combinedGsa: null,
        combinedGsb: null,
        gse: null,
        pli: null,
        percentsOfDosageWithBinder: []
      }
    ],
    binderInput: null,
    turnNumber: {
      initialN: null,
      maxN: null,
      projectN: null,
      tex: null,
    },
  },
  firstCompressionData: {
    inferiorRows: [{
      id: 0,
      diammeter: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      document: null
    }],
    intermediariaRows: [{
      id: 0,
      diammeter: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      document: null
    }],
    superiorRows: [{
      id: 0,
      diammeter: null,
      dryMass: null,
      submergedMass: null,
      drySurfaceSaturatedMass: null,
      waterTemperatureCorrection: null,
      document: null
    }],
    spreadSheetTemplate: null,
    maximumDensity: {
      lower: {
        gmm: null,
        gmb: null
      },
      average: {
        gmm: null,
        gmb: null
      },
      higher: {
        gmm: null,
        gmb: null
      }
    },
    riceTest: [
      {
        curve: null,
        drySampleMass: null,
        waterSampleMass: null,
        waterSampleContainerMass: null,
        gmm: 0,
        temperatureOfWater: null
      }
    ]
  }
};

const useSuperpaveStore = create<SuperpaveData & SuperpaveActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setData: ({ step, key, value }) =>
          set((state) => {
            if (step === 12) {
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

        reset: ({ step }) => {
          set(initialState);
          return {
            [stepVariant[step]]: null,
          };
        },
      }),
      {
        // name data store e config no session storage
        name: 'asphalt-superpave-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSuperpaveStore;
