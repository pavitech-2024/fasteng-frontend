import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

// ================== DEFINIÇÃO DO TIPO DE CADA CAMADA ==================
export interface LayerCard {
  id: string;
  title: string;

  // PARÂMETROS DO MATERIAL
  teorCimento: string;
  rt: string;
  rtcd: string;
  rcs: string;
  faixaGranulometrica: string;
  massaEspecifica: string;
  umidadeOtima: string;
  energiaCompactacao: string;

  // MÓDULO DE RESILIÊNCIA
  ei: string;
  ef: string;
  constanteA: string;
  constanteB: string;

  // FADIGA
  k1: string;
  k2: string;
}

// ================== INTERFACES DOS DADOS ==================
interface GeneralData {
  // IDENTIFICAÇÃO
  name: string | null;
  tipoSecao: string | null;
  faseMonitoramento: string | null;
  liberacaoTrafico: string | null;
  utilizadaMedina: string | null;
  utilizadaLvec: string | null;
  dadosConfirmadosICT: string | null;
  observations?: string | null;

  // PREPARO DO PAVIMENTO
  iriPreReabilitacao: string | null;
  atPreReabilitacao: string | null;
  fresagem: string | null;
  espessuraFresagem: string | null;
  intervencaoBase: string | null;
  sami: string | null;
  pinturaLigacao: string | null;
  imprimacao: string | null;

  // DATA ÚLTIMA ATUALIZAÇÃO
  dataUltimaAtualizacao: string | null;
  tempoServicoAnos: string | null;
  tempoServicoMeses: string | null;

  // CARACTERÍSTICAS
  local: string | null;
  municipioEstado: string | null;
  extensao: string | null;
  velocidadeDiretriz: string | null;
  kmInicial: string | null;
  kmFinal: string | null;
  inicioEstaca: string | null;
  inicioMetros: string | null;
  fimEstaca: string | null;
  fimMetros: string | null;
  altitudeMedia: string | null;
  numeroFaixas: string | null;
  faixaMonitorada: string | null;
  larguraFaixa: string | null;

  // COORDENADAS (vieram do step2)
  latitudeI: string | null;
  longitudeI: string | null;
  latitudeF: string | null;
  longitudeF: string | null;

  // COMPOSIÇÃO ESTRUTURAL
  structuralComposition: {
    id: number;
    layer: string | null;
    material: string | null;
    thickness: string | null;
  }[];

  imagemEstrutural: string | null;
  dataImagens: string | null;
}

interface Step2Data {
  layers: LayerCard[];
  observations: string | null;
}

export type StabilizedLayersData = {
  generalData: GeneralData;
  step2Data: Step2Data;
  _id?: string;
};

export type StabilizedLayersActions = {
  setData: ({ step, key, value }: setDataType) => void;
  clearStore: () => void;
  reset: () => void;
};

const stepVariant = { 0: 'generalData', 1: 'step2Data' };

export type setDataType = { step: number; key?: string; value: unknown };

const createEmptyLayer = (): LayerCard => ({
  id: crypto.randomUUID(),
  title: '',
  teorCimento: '',
  rt: '',
  rtcd: '',
  rcs: '',
  faixaGranulometrica: '',
  massaEspecifica: '',
  umidadeOtima: '',
  energiaCompactacao: '',
  ei: '',
  ef: '',
  constanteA: '',
  constanteB: '',
  k1: '',
  k2: '',
});

const initialState = {
  generalData: {
    name: null,
    tipoSecao: null,
    faseMonitoramento: null,
    liberacaoTrafico: null,
    utilizadaMedina: null,
    utilizadaLvec: null,
    dadosConfirmadosICT: null,
    observations: null,
    iriPreReabilitacao: null,
    atPreReabilitacao: null,
    fresagem: null,
    espessuraFresagem: null,
    intervencaoBase: null,
    sami: null,
    pinturaLigacao: null,
    imprimacao: null,
    dataUltimaAtualizacao: null,
    tempoServicoAnos: null,
    tempoServicoMeses: null,
    local: null,
    municipioEstado: null,
    extensao: null,
    velocidadeDiretriz: null,
    kmInicial: null,
    kmFinal: null,
    inicioEstaca: null,
    inicioMetros: null,
    fimEstaca: null,
    fimMetros: null,
    altitudeMedia: null,
    numeroFaixas: null,
    faixaMonitorada: null,
    larguraFaixa: null,
    latitudeI: null,
    longitudeI: null,
    latitudeF: null,
    longitudeF: null,
    structuralComposition: [{ id: 0, layer: null, material: null, thickness: null }],
    imagemEstrutural: null,
    dataImagens: null,
  },
  step2Data: {
    layers: [createEmptyLayer()],
    observations: null,
  },
  _id: null,
};

const useStabilizedLayersStore = create<StabilizedLayersData & StabilizedLayersActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setData: ({ step, key, value }) =>
          set((state) => {
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
          }),
        reset: () => set(initialState),
        clearStore: () => {
          sessionStorage.clear();
          set(initialState);
        },
      }),
      {
        name: 'stabilized-layers-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useStabilizedLayersStore;