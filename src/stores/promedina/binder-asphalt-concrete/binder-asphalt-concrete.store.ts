import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface GeneralData {
  name: string;
  zone: string;
  layer: string;
  cityState: string;
  observations?: string;
}

interface Step2Data {
  // PavimentData
  identification: string;
  sectionType: string;
  extension: string;
  initialStakeMeters: string;
  latitudeI: string;
  longitudeI: string;
  finalStakeMeters: string;
  latitudeF: string;
  longitudeF: string;
  monitoringPhase: string;
  observation: string;
  // Paviment Preparation
  milling: string;
  interventionAtTheBase: string;
  sami: string;
  bondingPaint: string;
  priming: string;
  images: string[];
  imagesDate: string;
  // Structural Composition
  structuralComposition: {
    id: number;
    layer: unknown;
    material: unknown;
    thickness: unknown;
  }[];
}

interface Step3Data {
  // PavimentData
  refinery: string; // Refinaria
  company: string; // Empresa
  collectionDate: string; // Data do carregamento
  invoiceNumber: string; // Número da nota fiscal
  dataInvoice: string; // Data da nota fiscal
  certificateDate: string; // Data do certificado
  capType: string; // Tipo de CAP
  performanceGrade: string; // Performance grade (PG)
  penetration: string; // Penetração - 25°C (mm)
  softeningPoint: string; // Ponto de amolecimento (°C)
  elasticRecovery: string; // Recuperação elástica - 25°C (%)
  // Viscosidade Brookfield
  vb_sp21_20: string; // 135°C (SP21, 20rpm)
  vb_sp21_50: string; // 150°C (SP21, 50rpm)
  vb_sp21_100: string; // 177°C (SP21, 100rpm)
  observations: string; // Observações
}

interface Step4Data {
  granulometricRange: string;
  tmn: string;
  asphaltTenor: string;
  specificMass: string;
  volumeVoids: string;
  abrasionLA: string;
  rt: string;
  flowNumber: string;
  mr: string;
  // Diametral Compression Fatigue Curve
  fatigueCurve_n_cps: string;
  fatigueCurve_k1: string;
  fatigueCurve_k2: string;
  fatigueCurve_r2: string;
  observations: string;
}

export type BinderAsphaltConcreteData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  step3Data: Step3Data;
  step4Data: Step4Data;
};

export type BinderAsphaltConcreteActions = {
  setData: ({ step, key, value }: setDataType) => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data', 2: 'step3Data', 3: 'step4Data' };

export type setDataType = { step: number; key?: string; value: unknown };

const useBinderAsphaltConcreteStore = create<BinderAsphaltConcreteData & BinderAsphaltConcreteActions>()(
  devtools(
    persist(
      (set) => ({
        generalData: {
          name: null,
          zone: null,
          layer: null,
          cityState: null,
          observations: null,
        },
        step2Data: {
          identification: null,
          sectionType: null,
          extension: null,
          initialStakeMeters: null,
          latitudeI: null,
          longitudeI: null,
          finalStakeMeters: null,
          latitudeF: null,
          longitudeF: null,
          monitoringPhase: null,
          observation: null,
          milling: null,
          interventionAtTheBase: null,
          sami: null,
          bondingPaint: null,
          priming: null,
          images: null,
          imagesDate: null,
          structuralComposition: [
            {
              id: 0,
              layer: null,
              material: null,
              thickness: null,
            },
          ],
        },
        step3Data: {
          refinery: null,
          company: null,
          collectionDate: null,
          invoiceNumber: null,
          dataInvoice: null,
          certificateDate: null,
          capType: null,
          performanceGrade: null,
          penetration: null,
          softeningPoint: null,
          elasticRecovery: null,
          vb_sp21_20: null,
          vb_sp21_50: null,
          vb_sp21_100: null,
          observations: null,
        },
        step4Data: {
          granulometricRange: null,
          tmn: null,
          asphaltTenor: null,
          specificMass: null,
          volumeVoids: null,
          abrasionLA: null,
          rt: null,
          flowNumber: null,
          mr: null,
          fatigueCurve_n_cps: null,
          fatigueCurve_k1: null,
          fatigueCurve_k2: null,
          fatigueCurve_r2: null,
          observations: null,
        },
        setData: ({ step, key, value }) =>
          set((state) => {
            if (key)
              return {
                ...state,
                [stepVariant[step]]: {
                  ...state[stepVariant[step]],
                  [key]: value,
                },
              };
            else return { ...state, [stepVariant[step]]: value };
          }),
      }),
      {
        // name data store e config no session storage
        name: 'binder-aphalt-concrete-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useBinderAsphaltConcreteStore;
