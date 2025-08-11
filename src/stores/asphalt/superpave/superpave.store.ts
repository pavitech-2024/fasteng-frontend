import { AsphaltMaterial } from '@/interfaces/asphalt';
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

interface SuperpaveGranulometryEssayData {
  materials: AsphaltMaterial[];
  granulometrys: {
    material: AsphaltMaterial;
    material_mass: number;
    table_data: { sieve_label: string; sieve_value: number; passant: number; retained: number }[];
    sieve_series: { label: string; value: number }[];
    bottom: number;
  }[];
  viscosity: {
    material: AsphaltMaterial;
    dataPoints: {
      id: number;
      temperature: number;
      viscosity: number;
    }[];
  };
}

interface SuperpaveGranulometryResults {
  granulometrys: {
    material: AsphaltMaterial;
    result: {
      accumulated_retained: [string, number][];
      graph_data: [number, number][];
      passant: [string, number][];
      retained_porcentage: [string, number][];
      total_retained: number;
      nominal_size: number;
      nominal_diameter: number;
      fineness_module: number;
      cc: number;
      cnu: number;
      error: number;
    };
  }[];
  viscosity: {
    material: AsphaltMaterial;
    result: {
      result: {
        graph: string;
        machiningTemperatureRange: {
          higher: number;
          lower: number;
          average: number;
        };
        compressionTemperatureRange: {
          higher: number;
          lower: number;
          average: number;
        };
        aggregateTemperatureRange: {
          higher: number;
          lower: number;
          average: number;
        };
        curvePoints: number[][];
        equation: {
          aIndex: number;
          bIndex: number;
        };
      };
    };
  };
}

interface SuperpaveGranulometryCompositionData {
  percentageInputs: {
    [key: string]: number;
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
  pointsOfCurve: number[][];
  chosenCurves: string[];
  bands: {
    higher: any[];
    lower: any[];
    letter: string;
  };
  porcentagesPassantsN200: any;
}

interface SuperpaveInitialBinderData {
  materials: {
    name: string;
    realSpecificMass: number;
    apparentSpecificMass: number;
    absorption: number;
    type: string;
  }[];
  binderSpecificMass: number;
  granulometryComposition: {
    combinedGsa: number;
    combinedGsb: number;
    gse: number;
    pli: number;
    percentsOfDosageWithBinder: number[];
    curve: string;
  }[];
  binderInput: { curve: string; value: number }[];
  turnNumber: {
    initialN: number;
    maxN: number;
    projectN: number;
    tex: string;
  };
}

interface FirstCompressionData {
  inferiorRows: {
    id: number;
    diammeter: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    document: string;
  }[];
  intermediariaRows: {
    id: number;
    diammeter: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    document: string;
  }[];
  superiorRows: {
    id: number;
    diammeter: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    document: string;
  }[];
  spreadSheetTemplate: string;
  maximumDensity: {
    lower: {
      gmm: number;
      gmb: number;
    };
    average: {
      gmm: number;
      gmb: number;
    };
    higher: {
      gmm: number;
      gmb: number;
    };
  };
  riceTest: {
    curve: string;
    drySampleMass: number;
    waterSampleMass: number;
    waterSampleContainerMass: number;
    gmm: number;
    temperatureOfWater: number;
  }[];
}

type Table2_Data = {
  percentWaterAbs: number;
  percentageGmmInitialN: number;
  percentageGmmMaxN: number;
  percentageGmmProjectN: number;
  porcentageVam: number;
  porcentageVv: number;
  ratioDustAsphalt: number;
  specificMass: number;
};

type FirstCurvePercentages_Table2 = {
  table2Lower?: Table2_Data;
  table2Average?: Table2_Data;
  table2Higher?: Table2_Data;
};

type Table3_LowerData = {
  expectedPercentageGmmInitialNLower: number;
  expectedPercentageGmmMaxNLower: number;
  expectedPliLower: number;
  expectedVamLower: number;
  expectedRBVLower: number;
  expectedRatioDustAsphaltLower: number;
};

type Table3_AverageData = {
  expectedPercentageGmmInitialNAverage: number;
  expectedPercentageGmmMaxNAverage: number;
  expectedPliAverage: number;
  expectedVamAverage: number;
  expectedRBVAverage: number;
  expectedRatioDustAsphaltAverage: number;
};

type Table3_HigherData = {
  expectedPercentageGmmInitialNHigher: number;
  expectedPercentageGmmMaxNHigher: number;
  expectedPliHigher: number;
  expectedVamHigher: number;
  expectedRBVHigher: number;
  expectedRatioDustAsphaltHigher: number;
};

type FirstCurvePercentages_Table3 = {
  table3Lower?: Table3_LowerData;
  table3Average?: Table3_AverageData;
  table3Higher?: Table3_HigherData;
};

type Table4_Data = {
  data: any[];
};

type FirstCurvePercentages_Table4 = {
  table4Lower?: Table4_Data;
  table4Average?: Table4_Data;
  table4Higher?: Table4_Data;
};

interface firstCompressionParamsData {
  table1: {
    expectedPorcentageGmmInitialN: number;
    expectedPorcentageGmmMaxN: number;
    expectedPorcentageGmmProjectN: number;
    expectedVam: number;
    expectedRBV_Higher: number;
    expectedRBV_Lower: number;
    nominalSize: number;
    trafficVolume: string;
  };
  table2: FirstCurvePercentages_Table2 | null;
  table3: FirstCurvePercentages_Table3 | null;
  table4: FirstCurvePercentages_Table4 | null;
  selectedCurve: string;
}
interface ChosenCurvePercentagesData {
  listOfPlis: number[];
  porcentageAggregate: number[][];
  trafficVolume: string;
}

interface SecondCompressionData {
  halfLess: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  halfPlus: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  normal: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  onePlus: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  maximumDensities: {
    insertedGmm: number;
    riceTest: {
      calculatedGmm: number;
      sampleAirDryMass: number;
      containerMassWaterSample: number;
      containerWaterMass: number;
      waterTemperatureCorrection: number | string;
    };
  }[];
  composition: {
    halfLess: {
      projectN: {
        samplesData: any[];
        gmb: number;
        percentWaterAbs: number;
        percentageGmm: number;
      };
      specifiesMass: number;
      gmm: number;
      Vv: number;
      Vam: number;
      expectedPli: number;
      RBV: number;
      ratioDustAsphalt: number;
      indirectTensileStrength: number;
    };
    normal: {
      projectN: {
        samplesData: any[];
        gmb: number;
        percentWaterAbs: number;
        percentageGmm: number;
      };
      specifiesMass: number;
      gmm: number;
      Vv: number;
      Vam: number;
      RBV: number;
      ratioDustAsphalt: number;
      indirectTensileStrength: number;
    };
    halfPlus: {
      projectN: {
        samplesData: any[];
        gmb: number;
        percentWaterAbs: number;
        percentageGmm: number;
      };
      specifiesMass: number;
      gmm: number;
      Vv: number;
      Vam: number;
      RBV: number;
      ratioDustAsphalt: number;
      indirectTensileStrength: number;
    };
    onePlus: {
      projectN: {
        samplesData: any[];
        gmb: number;
        percentWaterAbs: number;
        percentageGmm: number;
      };
      specifiesMass: number;
      gmm: number;
      Vv: number;
      Vam: number;
      RBV: number;
      ratioDustAsphalt: number;
      indirectTensileStrength: number;
    };
  };
  expectedPli: number;
  combinedGsb: number;
  percentsOfDosage: number[];
  Gse: number;
  ponderatedPercentsOfDosage: number[];
}

interface SecondCompressionPercentagesData {
  optimumContent: number;
  graphs: {
    graphVv: any[];
    graphVam: any[];
    graphGmb: any[];
    graphGmm: any[];
    graphRBV: any[];
    graphPA: any[];
    graphRT: any[];
  };
}

interface ConfirmationCompressionData {
  table: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  gmm: number;
  riceTest: {
    sampleAirDryMass: number;
    containerSampleWaterMass: number;
    containerWaterMass: number;
    temperatureOfWater: number;
  };
}

interface DosageResume {
  Gmb: number;
  Gmm: number;
  RBV: number;
  Vam: number;
  Vv: number;
  diametralTractionResistance: number;
  gmm: number;
  percentWaterAbs: number;
  ponderatedPercentsOfDosage: number[];
  quantitative: number[];
  ratioDustAsphalt: number;
  specifiesMass: number;
}

export type SuperpaveData = {
  generalData: SuperpaveGeneralData;
  granulometryEssayData: SuperpaveGranulometryEssayData;
  granulometryResultsData: SuperpaveGranulometryResults;
  granulometryCompositionData: SuperpaveGranulometryCompositionData;
  initialBinderData: SuperpaveInitialBinderData;
  firstCompressionData: FirstCompressionData;
  firstCompressionParamsData: firstCompressionParamsData;
  chosenCurvePercentagesData: ChosenCurvePercentagesData;
  secondCompressionData: SecondCompressionData;
  secondCompressionPercentagesData: SecondCompressionPercentagesData;
  confirmationCompressionData: ConfirmationCompressionData;
  dosageResume: DosageResume;
  createdAt: Date;
};

export type SuperpaveActions = {
  setData: ({ step, key, value }: setDataType) => void;
  setAllData: (value: Partial<SuperpaveData>) => void;
  reset: () => void;
  clearStore: () => void;
};

type setDataType = { step: number; key?: string; value: unknown };

const stepVariant = {
  0: 'generalData',
  1: 'granulometryEssayData',
  2: 'granulometryResultsData',
  3: 'granulometryCompositionData',
  4: 'initialBinderData',
  5: 'firstCompressionData',
  6: 'firstCompressionParamsData',
  7: 'chosenCurvePercentagesData',
  8: 'secondCompressionData',
  9: 'secondCompressionPercentagesData',
  10: 'confirmationCompressionData',
  11: 'dosageResume',
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
  granulometryEssayData: {
    materials: [],
    granulometrys: [],
    viscosity: null,
  },
  granulometryResultsData: {
    granulometrys: [],
    viscosity: null,
  },
  granulometryCompositionData: {
    porcentagesPassantsN200: null,
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
    percentageInputs: [],
    percentsToList: [],
    nominalSize: {
      value: null,
    },
    pointsOfCurve: [],
    chosenCurves: [],
    bands: {
      higher: [],
      lower: [],
      letter: null,
    },
  },
  initialBinderData: {
    materials: [
      {
        name: null,
        realSpecificMass: null,
        apparentSpecificMass: null,
        absorption: null,
        type: null,
      },
    ],
    binderSpecificMass: null,
    granulometryComposition: [
      {
        combinedGsa: null,
        combinedGsb: null,
        gse: null,
        pli: null,
        percentsOfDosageWithBinder: [],
        curve: null,
      },
    ],
    binderInput: [],
    turnNumber: {
      initialN: null,
      maxN: null,
      projectN: null,
      tex: null,
    },
  },
  firstCompressionData: {
    inferiorRows: [
      {
        id: 0,
        diammeter: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        document: null,
      },
    ],
    intermediariaRows: [
      {
        id: 0,
        diammeter: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        document: null,
      },
    ],
    superiorRows: [
      {
        id: 0,
        diammeter: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        document: null,
      },
    ],
    spreadSheetTemplate: null,
    maximumDensity: {
      lower: {
        gmm: null,
        gmb: null,
      },
      average: {
        gmm: null,
        gmb: null,
      },
      higher: {
        gmm: null,
        gmb: null,
      },
    },
    riceTest: [],
  },
  firstCompressionParamsData: {
    table1: {
      expectedPorcentageGmmInitialN: null,
      expectedPorcentageGmmMaxN: null,
      expectedPorcentageGmmProjectN: null,
      expectedRBV_Higher: null,
      expectedRBV_Lower: null,
      nominalSize: null,
      trafficVolume: null,
      expectedVam: null,
    },
    table2: null,
    table3: null,
    table4: null,
    selectedCurve: null,
  },
  chosenCurvePercentagesData: {
    listOfPlis: [],
    porcentageAggregate: [[]],
    trafficVolume: null,
  },
  secondCompressionData: {
    halfLess: [
      {
        id: 0,
        averageDiammeter: null,
        averageHeight: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        diametralTractionResistance: null,
      },
    ],
    halfPlus: [
      {
        id: 0,
        averageDiammeter: null,
        averageHeight: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        diametralTractionResistance: null,
      },
    ],
    normal: [
      {
        id: 0,
        averageDiammeter: null,
        averageHeight: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        diametralTractionResistance: null,
      },
    ],
    onePlus: [
      {
        id: 0,
        averageDiammeter: null,
        averageHeight: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        diametralTractionResistance: null,
      },
    ],
    maximumDensities: [
      {
        id: 0,
        insertedGmm: null,
        riceTest: {
          calculatedGmm: null,
          sampleAirDryMass: null,
          containerMassWaterSample: null,
          containerWaterMass: null,
          waterTemperatureCorrection: null,
        },
      },
      {
        id: 1,
        insertedGmm: null,
        riceTest: {
          calculatedGmm: null,
          sampleAirDryMass: null,
          containerMassWaterSample: null,
          containerWaterMass: null,
          waterTemperatureCorrection: null,
        },
      },
      {
        id: 2,
        insertedGmm: null,
        riceTest: {
          calculatedGmm: null,
          sampleAirDryMass: null,
          containerMassWaterSample: null,
          containerWaterMass: null,
          waterTemperatureCorrection: null,
        },
      },
      {
        id: 3,
        insertedGmm: null,
        riceTest: {
          calculatedGmm: null,
          sampleAirDryMass: null,
          containerMassWaterSample: null,
          containerWaterMass: null,
          waterTemperatureCorrection: null,
        },
      },
    ],
    composition: {
      halfLess: {
        projectN: {
          samplesData: null,
          gmb: null,
          percentWaterAbs: null,
          percentageGmm: null,
        },
        specifiesMass: null,
        gmm: null,
        Vv: null,
        Vam: null,
        expectedPli: null,
        RBV: null,
        ratioDustAsphalt: null,
        indirectTensileStrength: null,
      },
      normal: {
        projectN: {
          samplesData: null,
          gmb: null,
          percentWaterAbs: null,
          percentageGmm: null,
        },
        specifiesMass: null,
        gmm: null,
        Vv: null,
        Vam: null,
        RBV: null,
        ratioDustAsphalt: null,
        indirectTensileStrength: null,
      },
      halfPlus: {
        projectN: {
          samplesData: null,
          gmb: null,
          percentWaterAbs: null,
          percentageGmm: null,
        },
        specifiesMass: null,
        gmm: null,
        Vv: null,
        Vam: null,
        RBV: null,
        ratioDustAsphalt: null,
        indirectTensileStrength: null,
      },
      onePlus: {
        projectN: {
          samplesData: null,
          gmb: null,
          percentWaterAbs: null,
          percentageGmm: null,
        },
        specifiesMass: null,
        gmm: null,
        Vv: null,
        Vam: null,
        RBV: null,
        ratioDustAsphalt: null,
        indirectTensileStrength: null,
      },
    },
    expectedPli: null,
    combinedGsb: null,
    percentsOfDosage: null,
    Gse: null,
    ponderatedPercentsOfDosage: null,
  },
  secondCompressionPercentagesData: {
    optimumContent: null,
    graphs: {
      graphVv: [],
      graphVam: [],
      graphGmb: [],
      graphGmm: [],
      graphRBV: [],
      graphPA: [],
      graphRT: [],
    },
  },
  confirmationCompressionData: {
    table: [
      {
        id: 1,
        averageDiammeter: null,
        averageHeight: null,
        dryMass: null,
        submergedMass: null,
        drySurfaceSaturatedMass: null,
        waterTemperatureCorrection: null,
        diametralTractionResistance: null,
      },
    ],
    gmm: null,
    riceTest: {
      sampleAirDryMass: null,
      containerSampleWaterMass: null,
      containerWaterMass: null,
      temperatureOfWater: null,
    },
  },
  dosageResume: {
    Gmb: null,
    Gmm: null,
    RBV: null,
    Vam: null,
    Vv: null,
    diametralTractionResistance: null,
    gmm: null,
    percentWaterAbs: null,
    ponderatedPercentsOfDosage: [],
    quantitative: [],
    ratioDustAsphalt: null,
    specifiesMass: null,
  },
  createdAt: null,
  updatedAt: null,
};

type Hydration = {
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

const useSuperpaveStore = create<SuperpaveData & SuperpaveActions & Hydration>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        hasHydrated: false,
        setHasHydrated: (state) => set({ hasHydrated: state }),

        setData: ({ step, key, value }) =>
          set((state) => {
            const stepKey = stepVariant[step];
            if (key) {
              return {
                ...state,
                [stepKey]: {
                  ...state[stepKey],
                  [key]: value,
                },
              };
            } else {
              return { ...state, [stepKey]: value };
            }
          }),

        setAllData: (value: Partial<SuperpaveData>) =>
          set((state) => ({
            ...state,
            ...value,
          })),

        reset: () => {
          set(initialState);
        },

        clearStore: () => {
          sessionStorage.clear();
        },
      }),
      {
        // name data store e config no session storage
        name: 'asphalt-superpave-store',
        storage: createJSONStorage(() => sessionStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);

export default useSuperpaveStore;
export const getSuperpaveStore = useSuperpaveStore;
