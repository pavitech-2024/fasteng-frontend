// src/stores/promedina/igg/igg.store.ts
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
  defects: IggDefect[];
  date?: string;
}

export interface IggGeneralData {
  name: string;
  description?: string;
  road: string;
  section: string;
  subtrack?: string;
  pavementType: string;
  evaluationDate: string;
}

export interface IggResults {
  generalData: Record<string, unknown>;
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
}

export interface IggAnalysisData {
  _id?: string;
  generalData: IggGeneralData;
  stations: IggStation[];
  results?: IggResults;
  status?: string;
  userId?: string;
}

export interface IggAnalysisActions {
  setData: (data: Partial<IggAnalysisData>) => void;
  setGeneralData: (generalData: IggGeneralData) => void;
  setStations: (stations: IggStation[]) => void;
  setResults: (results: IggResults) => void;
  addStation: (station: IggStation) => void;
  updateStation: (id: number, station: Partial<IggStation>) => void;
  removeStation: (id: number) => void;
  reset: () => void;
  clearStore: () => void;
}

const initialState: IggAnalysisData = {
  generalData: {
    name: '',
    description: '',
    road: '',
    section: '',
    subtrack: '',
    pavementType: '',
    evaluationDate: new Date().toISOString().split('T')[0],
  },
  stations: [],
  status: 'draft',
};

export const useIggStore = create<IggAnalysisData & IggAnalysisActions>((set) => ({
  ...initialState,

  setData: (data: Partial<IggAnalysisData>) =>
    set((state) => ({ ...state, ...data })),

  setGeneralData: (generalData: IggGeneralData) =>
    set((state) => ({ ...state, generalData })),

  setStations: (stations: IggStation[]) =>
    set((state) => ({ ...state, stations })),

  setResults: (results: IggResults) =>
    set((state) => ({ ...state, results })),

  addStation: (station: IggStation) =>
    set((state) => ({ ...state, stations: [...state.stations, station] })),

  updateStation: (id: number, stationUpdate: Partial<IggStation>) =>
    set((state) => ({
      ...state,
      stations: state.stations.map((s) =>
        s.id === id ? { ...s, ...stationUpdate } : s
      ),
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