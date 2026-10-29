import { create } from 'zustand';

// Interfaces
export interface IggDefect {
  code: string;
  count: number;
}

export interface IggStation {
  id: number;
  stationNumber: string;
  section: string;
  tri: number;
  tre: number;
  totalDefeitos?: number;
  defects: IggDefect[];
  date?: string;

  iggs: number[];
  igis: number[][];
  arrowsAverage: number[];
  variancesAverage: number[];
  conditions: string[];
}

export interface IggGeneralData {
  name: string;
  description?: string;
  operator?: string;
  calculist?: string;
  road: string;
  section: string;
  subtrack?: string;
  pavementType: string;
  evaluationDate: string;
  createdAt: string;

  work: string;
  initialStake: number | string;
  initialSide: string;
  finalStake: number | string;
  finalSide: string;
}

export interface IggResults {
  statistics: {
    flechas_TRI: { media: number; variancia: number };
    flechas_TRE: { media: number; variancia: number };
    F: number;
    FV: number;
    frequencias_absolutas: Record<number, number>;
    frequencias_relativas: Record<number, number>;
    IGI_tipos: Record<number, number>;
    IGI_F: number;
    IGI_FV: number;
    IGG: number;
    classificacao: string;
    cor_classificacao: string;
    estacao_critica: IggStation | null;
    total_defeitos: number;
    composicao_igg: { fator: string; valor: number; tipo?: number }[];
    total_estacoes: number;
  };
  iggs?: number[];
  igis?: number[][];
  arrowsAverage?: number[];
  variancesAverage?: number[];
  conditions?: string[];
}

export interface IggSection {
  id: number;
  initial: number | null;
  final: number | null;
}

export interface IggAnalysisData {
  _id?: string;
  generalData: IggGeneralData;
  stations: IggStation[];
  sections: IggSection[];
  results?: IggResults;
  status?: string;
  userId?: string;
}

export interface IggAnalysisActions {
  setData: (data: Partial<IggAnalysisData>) => void;
  setGeneralData: (generalData: IggGeneralData) => void;
  setStations: (stations: IggStation[]) => void;
  setSections: (sections: IggSection[]) => void;
  setResults: (results: IggResults) => void;
  addStation: (station: IggStation) => void;
  updateStation: (id: number, station: Partial<IggStation>) => void;
  removeStation: (id: number) => void;
  reset: () => void;
  clearStore: () => void;
}

const initialState: IggAnalysisData = {
  _id: undefined,
  generalData: {
    name: '',
    description: '',
    road: '',
    section: '',
    subtrack: '',
    pavementType: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    createdAt: "",
    work: '',
    initialStake: '',
    initialSide: '',
    finalStake: '',
    finalSide: '',
  },
  stations: [],
  sections: [],
  status: 'draft',
};

export const UseIggStore = create<IggAnalysisData & IggAnalysisActions>((set) => ({
  ...initialState,

  setData: (data: Partial<IggAnalysisData>) => set((state) => ({ ...state, ...data })),

  setGeneralData: (generalData: IggGeneralData) => set((state) => ({ ...state, generalData })),

  setStations: (stations: IggStation[]) => set((state) => ({ ...state, stations })),

  setSections: (sections: IggSection[]) => set((state) => ({ ...state, sections })),

  setResults: (results: IggResults) => set((state) => ({ ...state, results })),

  addStation: (station: IggStation) =>
    set((state) => ({
      ...state,
      stations: [...state.stations, station],
    })),

  updateStation: (id: number, stationUpdate: Partial<IggStation>) =>
    set((state) => ({
      ...state,
      stations: state.stations.map((s) => (s.id === id ? { ...s, ...stationUpdate } : s)),
    })),

  removeStation: (id: number) =>
    set((state) => ({
      ...state,
      stations: state.stations.filter((s) => s.id !== id),
    })),

  reset: () => set(initialState),

  clearStore: () => {
    sessionStorage.clear();
    set(initialState);
  },
}));