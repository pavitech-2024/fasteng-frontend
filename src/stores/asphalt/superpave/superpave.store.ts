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
  porcentagesPassantsN200: any;
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
    percentsOfDosageWithBinder: number[];
  }[];
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

interface FirstCurvePercentageData {
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
  table2: {
    table2Lower: {
      percentWaterAbs: null;
      percentageGmmInitialN: null;
      percentageGmmMaxN: null;
      percentageGmmProjectN: null;
      porcentageVam: null;
      porcentageVv: null;
      ratioDustAsphalt: null;
      specificMass: null;
    };
    table2Average: {
      percentWaterAbs: null;
      percentageGmmInitialN: null;
      percentageGmmMaxN: null;
      percentageGmmProjectN: null;
      porcentageVam: null;
      porcentageVv: null;
      ratioDustAsphalt: null;
      specificMass: null;
    };
    table2Higher: {
      percentWaterAbs: null;
      percentageGmmInitialN: null;
      percentageGmmMaxN: null;
      percentageGmmProjectN: null;
      porcentageVam: null;
      porcentageVv: null;
      ratioDustAsphalt: null;
      specificMass: null;
    };
  };
  table3: {
    table3Lower: {
      expectedPercentageGmmInitialNLower: number;
      expectedPercentageGmmMaxNLower: number;
      expectedPliLower: number;
      expectedVamLower: number;
      expectedRBVLower: number;
      expectedRatioDustAsphaltLower: number;
    };
    table3Average: {
      expectedPercentageGmmInitialNAverage: number;
      expectedPercentageGmmMaxNAverage: number;
      expectedPliAverage: number;
      expectedVamAverage: number;
      expectedRBVAverage: number;
      expectedRatioDustAsphaltAverage: number;
    };
    table3Higher: {
      expectedPercentageGmmInitialNHigher: number;
      expectedPercentageGmmMaxNHigher: number;
      expectedPliHigher: number;
      expectedVamHigher: number;
      expectedRBVHigher: number;
      expectedRatioDustAsphaltHigher: number;
    };
  };
  table4: {
    table4Lower: {
      data: any[];
    };
    table4Average: {
      data: any[];
    };
    table4Higher: {
      data: any[];
    };
  };
  selectedCurve: string;
}
interface ChosenCurvePercentagesData {
  listOfPlis: number[];
  porcentageAggregate: number[][];
  trafficVolume: string;
}

interface SecondCompressionData {
  tableData_0: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  tableData_1: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  tableData_2: {
    id: number;
    averageDiammeter: number;
    averageHeight: number;
    dryMass: number;
    submergedMass: number;
    drySurfaceSaturatedMass: number;
    waterTemperatureCorrection: number;
    diametralTractionResistance: number;
  }[];
  tableData_3: {
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
      sampleAirDryMass: number;
      containerMassWaterSample: number;
      containerWaterMass: number;
      waterTemperatureCorrection: number | string;
    };
  }[];
}

export type SuperpaveData = {
  generalData: SuperpaveGeneralData;
  materialSelectionData: SuperpaveMaterialSelectionData;
  granulometryCompositionData: SuperpaveGranulometryCompositionData;
  initialBinderData: SuperpaveInitialBinderData;
  firstCompressionData: FirstCompressionData;
  firstCurvePercentageData: FirstCurvePercentageData;
  chosenCurvePercentagesData: ChosenCurvePercentagesData;
  secondCompressionData: SecondCompressionData;
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
  4: 'firstCompressionData',
  5: 'firstCurvePercentageData',
  6: 'chosenCurvePercentagesData',
  7: 'secondCompressionData',
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
    materials: [
      {
        name: null,
        realSpecificMass: null,
        apparentSpecificMass: null,
        absorption: null,
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
      },
      {
        combinedGsa: null,
        combinedGsb: null,
        gse: null,
        pli: null,
        percentsOfDosageWithBinder: [],
      },
      {
        combinedGsa: null,
        combinedGsb: null,
        gse: null,
        pli: null,
        percentsOfDosageWithBinder: [],
      },
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
    riceTest: [
      {
        curve: null,
        drySampleMass: null,
        waterSampleMass: null,
        waterSampleContainerMass: null,
        gmm: 0,
        temperatureOfWater: null,
      },
    ],
  },
  firstCurvePercentageData: {
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
    table2: {
      table2Lower: {
        percentWaterAbs: null,
        percentageGmmInitialN: null,
        percentageGmmMaxN: null,
        percentageGmmProjectN: null,
        porcentageVam: null,
        porcentageVv: null,
        ratioDustAsphalt: null,
        specificMass: null,
      },
      table2Average: {
        percentWaterAbs: null,
        percentageGmmInitialN: null,
        percentageGmmMaxN: null,
        percentageGmmProjectN: null,
        porcentageVam: null,
        porcentageVv: null,
        ratioDustAsphalt: null,
        specificMass: null,
      },
      table2Higher: {
        percentWaterAbs: null,
        percentageGmmInitialN: null,
        percentageGmmMaxN: null,
        percentageGmmProjectN: null,
        porcentageVam: null,
        porcentageVv: null,
        ratioDustAsphalt: null,
        specificMass: null,
      },
    },
    table3: {
      table3Lower: {
        expectedPercentageGmmInitialNLower: null,
        expectedPercentageGmmMaxNLower: null,
        expectedPliLower: null,
        expectedVamLower: null,
        expectedRBVLower: null,
        expectedRatioDustAsphaltLower: null,
      },
      table3Average: {
        expectedPercentageGmmInitialNAverage: null,
        expectedPercentageGmmMaxNAverage: null,
        expectedPliAverage: null,
        expectedVamAverage: null,
        expectedRBVAverage: null,
        expectedRatioDustAsphaltAverage: null,
      },
      table3Higher: {
        expectedPercentageGmmInitialNHigher: null,
        expectedPercentageGmmMaxNHigher: null,
        expectedPliHigher: null,
        expectedVamHigher: null,
        expectedRBVHigher: null,
        expectedRatioDustAsphaltHigher: null,
      },
    },
    table4: {
      table4Lower: {
        data: [],
      },
      table4Average: {
        data: [],
      },
      table4Higher: {
        data: [],
      },
    },
    selectedCurve: null,
  },
  chosenCurvePercentagesData: {
    listOfPlis: [],
    porcentageAggregate: [[]],
    trafficVolume: null,
  },
  secondCompressionData: {
    tableData_0: [
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
    tableData_1: [
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
    tableData_2: [
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
    tableData_3: [
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
          sampleAirDryMass: null,
          containerMassWaterSample: null,
          containerWaterMass: null,
          waterTemperatureCorrection: null,
        },
      },
    ],
  },
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
