import { FWDData } from '@/services/asphalt/essays/fwd/fwdApi';

export interface Subtrecho {
  'Início (Estaca)': number;
  'Fim (Estaca)': number;
  'Comprimento (m)': number;
  'N Amostras': number;
  d0: number;
  d20: number;
  d30: number;
  d45: number;
  d60: number;
  d90: number;
  d120: number;
  d150: number;
  d180: number;
}

export interface ProcessResult {
  subtrechos: Subtrecho[];
  ordered: FWDData[];
  media_d0: number[];
  std_d0: number[];
  cv_d0: number[];
  quebra: boolean[];
}

const CONFIG = {
  CV_LIMIAR: 30,           // Coeficiente de Variação (%) para quebra
  COMPRIMENTO_MAX: 2000,   // Metros máximo por subtrecho
  COMPRIMENTO_MIN: 200,    // Metros mínimo por subtrecho
  ESTACA_METROS: 20,       // Conversão estaca para metros
  JANELA: 5,               // Tamanho da janela móvel
};

const coef_K: Record<number, number> = {
  4: 3.0, 5: 1.55, 6: 1.41, 7: 1.36, 8: 1.31, 9: 1.25, 10: 1.21,
  11: 1.2, 12: 1.16, 13: 1.13, 14: 1.11, 15: 1.1, 16: 1.08, 17: 1.06,
  18: 1.05, 19: 1.04, 20: 1.02, 21: 1.01, 22: 1.0, 23: 1.0, 24: 1.0,
  25: 1.0, 26: 1.0, 27: 1.0, 28: 1.0, 29: 1.0, 30: 1.0,
};

export function getCoefK(n: number): number {
  if (n < 4) return 3.0;
  if (n > 30) return 1.0;
  return coef_K[n] ?? 1.0;
}

export function rollingWindow(arr: number[], window: number): { media: number[]; std: number[] } {
  const media: number[] = [];
  const std: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1);
    const m = slice.reduce((a, b) => a + b, 0) / slice.length;
    const s = Math.sqrt(slice.reduce((a, b) => a + (b - m) * (b - m), 0) / slice.length);
    media.push(m);
    std.push(s);
  }
  return { media, std };
}

/**
 * Processa os dados FWD e gera subtrechos homogêneos
 *
 * Critérios:
 * - CV > 30% → quebra (cria novo subtrecho)
 * - Comprimento máximo: 2000m
 * - Comprimento mínimo: 200m (exceto último subtrecho)
 * - Último subtrecho: SEM restrição de comprimento mínimo
 */
export function processarSubtrechos(dados: FWDData[]): ProcessResult {
  const colDef = ['d0', 'd20', 'd30', 'd45', 'd60', 'd90', 'd120', 'd150', 'd180'] as const;
  const max_len_metros = CONFIG.COMPRIMENTO_MAX;
  const min_len_metros = CONFIG.COMPRIMENTO_MIN;
  const estaca_para_metros = CONFIG.ESTACA_METROS;
  const janela = CONFIG.JANELA;
  const limiar_cv = CONFIG.CV_LIMIAR;

  // Ordenar por estaca
  const ordered = [...dados].sort((a, b) => a.stationNumber - b.stationNumber);

  // Calcular janela móvel para d0
  const d0Arr = ordered.map(r => r.d0);
  const { media: media_d0, std: std_d0 } = rollingWindow(d0Arr, janela);

  // Calcular Coeficiente de Variação
  const cv_d0 = std_d0.map((s, i) => (media_d0[i] ? (s / media_d0[i]) * 100 : 0));

  // Marcar pontos de quebra (CV > 30%)
  const quebra = cv_d0.map(cv => cv > limiar_cv);

  const subtrechos: Subtrecho[] = [];
  let atual = 0;
  let inicio = ordered[0]?.stationNumber ?? 0;

  for (let i = 1; i < ordered.length; i++) {
    const comprimento_estacas = ordered[i].stationNumber - ordered[atual].stationNumber;
    const comprimento_metros = comprimento_estacas * estaca_para_metros;

    // Verifica se deve quebrar: CV > 30% OU comprimento máximo atingido
    const deve_quebrar = quebra[i] || comprimento_metros >= max_len_metros;

    // Só cria subtrecho se tiver comprimento mínimo (exceto último)
    if (deve_quebrar && comprimento_metros >= min_len_metros) {
      const fim = ordered[i - 1].stationNumber;
      const trecho = ordered.slice(atual, i);
      const n_amostras = i - atual;

      // Calcular médias e desvios
      const medias: Record<string, number> = {};
      const desvios: Record<string, number> = {};

      colDef.forEach(col => {
        const vals = trecho.map(x => x[col]);
        medias[col] = vals.reduce((a, b) => a + b, 0) / vals.length;
        desvios[col] = Math.sqrt(vals.reduce((a, b) => a + (b - medias[col]) ** 2, 0) / vals.length);
      });

      // Calcular deflexões características (média + K * desvio)
      const K = getCoefK(n_amostras);
      const deflexoes_char: any = {};
      colDef.forEach(col => {
        deflexoes_char[col] = Number((medias[col] + K * desvios[col]).toFixed(1));
      });

      subtrechos.push({
        'Início (Estaca)': inicio,
        'Fim (Estaca)': fim,
        'Comprimento (m)': Number(((fim - inicio) * estaca_para_metros).toFixed(1)),
        'N Amostras': n_amostras,
        ...deflexoes_char,
      } as Subtrecho);

      atual = i;
      inicio = ordered[i].stationNumber;
    }
  }

  // ÚLTIMO SUBTRECHO - SEM restrição de comprimento mínimo
  const fim = ordered[ordered.length - 1]?.stationNumber ?? 0;
  const n_amostras = ordered.length - atual;

  if (n_amostras > 0) {
    const trecho = ordered.slice(atual);

    const medias: Record<string, number> = {};
    const desvios: Record<string, number> = {};

    colDef.forEach(col => {
      const vals = trecho.map(x => x[col]);
      medias[col] = vals.reduce((a, b) => a + b, 0) / vals.length;
      desvios[col] = Math.sqrt(vals.reduce((a, b) => a + (b - medias[col]) ** 2, 0) / vals.length);
    });

    const K = getCoefK(n_amostras);
    const deflexoes_char: any = {};
    colDef.forEach(col => {
      deflexoes_char[col] = Number((medias[col] + K * desvios[col]).toFixed(1));
    });

    const comprimento_final = Number(((fim - inicio) * estaca_para_metros).toFixed(1));

    subtrechos.push({
      'Início (Estaca)': inicio,
      'Fim (Estaca)': fim,
      'Comprimento (m)': comprimento_final,
      'N Amostras': n_amostras,
      ...deflexoes_char,
    } as Subtrecho);
  }

  return {
    subtrechos,
    ordered,
    media_d0,
    std_d0,
    cv_d0,
    quebra,
  };
}