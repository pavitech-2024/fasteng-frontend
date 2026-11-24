/**
 * utils/granulometry-calc.ts
 *
 * Regra central: RETIDO (g) é a fonte da verdade. O passante (%) é sempre derivado:
 *
 *   passante_i = 100 * (massa - Σ retido_0..i) / massa
 *
 * Editar o passante de UMA peneira converte aquele valor em retido apenas
 * daquela linha. As linhas de baixo mantêm o retido que o usuário digitou —
 * elas nunca são sobrescritas, só têm o % recalculado.
 *
 * Nada aqui faz "clamp" silencioso. Valores inconsistentes são deixados como
 * estão e sinalizados por `validateGranulometry`, para o usuário ver o erro em
 * vez de ver o número dele sumir.
 */

export interface GranulometryRow {
  sieve_label: string;
  sieve_value: number;
  passant: number;
  retained: number;
}

export interface GranulometryResult {
  rows: GranulometryRow[];
  totalRetained: number;
  bottom: number;
}

export const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Converte o texto cru do input em número.
 * Aceita vírgula (pt-BR) e devolve null para estados intermediários ("", ",", "-").
 * É isso que permite apagar o campo sem que ele "vire" outro número.
 */
export const parseDecimal = (raw: string | number | null | undefined): number | null => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;

  const cleaned = raw.replace(/\s/g, '').replace(',', '.');
  if (cleaned === '' || cleaned === '.' || cleaned === '-' || cleaned === '-.') return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

/** Formata para exibição em pt-BR, sem casas decimais inúteis. */
export const formatDecimal = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return String(Number(value.toFixed(decimals))).replace('.', ',');
};

/** Recalcula todos os passantes a partir dos retidos. */
export const recalcFromRetained = (rows: GranulometryRow[], mass: number): GranulometryResult => {
  let accumulated = 0;

  const nextRows = rows.map((row) => {
    const retained = round2(row.retained ?? 0);
    accumulated = round2(accumulated + retained);
    const passant = mass > 0 ? round2((100 * (mass - accumulated)) / mass) : 0;
    return { ...row, retained, passant };
  });

  return { rows: nextRows, totalRetained: accumulated, bottom: round2(mass - accumulated) };
};

/** Recalcula todos os retidos a partir dos passantes (usado ao trocar a massa no modo %). */
export const recalcFromPassant = (rows: GranulometryRow[], mass: number): GranulometryResult => {
  let previousPassant = 100;
  let accumulated = 0;

  const nextRows = rows.map((row) => {
    const passant = row.passant ?? previousPassant;
    const retained = round2((mass * (previousPassant - passant)) / 100);
    accumulated = round2(accumulated + retained);
    previousPassant = passant;
    return { ...row, passant, retained };
  });

  return { rows: nextRows, totalRetained: accumulated, bottom: round2(mass - accumulated) };
};

/** Grava o retido de uma linha. `null` = campo vazio, tratado como 0. */
export const setRetainedAt = (
  rows: GranulometryRow[],
  mass: number,
  index: number,
  value: number | null
): GranulometryResult => {
  const draft = rows.map((row, i) => (i === index ? { ...row, retained: value ?? 0 } : { ...row }));
  return recalcFromRetained(draft, mass);
};

/**
 * Grava o passante de uma linha convertendo-o em retido daquela linha.
 * Só a linha editada muda de retido — as demais são preservadas.
 */
export const setPassantAt = (
  rows: GranulometryRow[],
  mass: number,
  index: number,
  value: number | null
): GranulometryResult => {
  const previousPassant = index === 0 ? 100 : rows[index - 1].passant;
  const passant = value ?? previousPassant;
  const retained = round2((mass * (previousPassant - passant)) / 100);

  const draft = rows.map((row, i) => (i === index ? { ...row, retained } : { ...row }));
  return recalcFromRetained(draft, mass);
};

export interface GranulometryValidation {
  isValid: boolean;
  invalidRows: number[];
  messages: string[];
}

export const validateGranulometry = (
  rows: GranulometryRow[],
  mass: number,
  bottom: number
): GranulometryValidation => {
  const invalidRows: number[] = [];
  const messages: string[] = [];
  const TOLERANCE = 0.005;

  if (!(mass > 0)) messages.push('Informe a massa total do material.');

  rows.forEach((row, index) => {
    const previousPassant = index === 0 ? 100 : rows[index - 1].passant;

    if (row.retained < -TOLERANCE) invalidRows.push(index);
    else if (row.passant < -TOLERANCE) invalidRows.push(index);
    else if (row.passant > previousPassant + TOLERANCE) invalidRows.push(index);
  });

  if (invalidRows.length > 0) {
    messages.push('Peneiras destacadas: o passante não pode ser maior que o da peneira acima, nem o retido negativo.');
  }

  if (bottom < -TOLERANCE) {
    messages.push('A soma dos retidos ultrapassa a massa do material.');
  }

  return { isValid: messages.length === 0, invalidRows, messages };
};

/** Tabela zerada para uma série de peneiras. */
export const buildEmptyTable = (sieves: { label: string; value: number }[]): GranulometryRow[] =>
  sieves.map((sieve) => ({
    sieve_label: sieve.label,
    sieve_value: sieve.value,
    passant: 100,
    retained: 0,
  }));