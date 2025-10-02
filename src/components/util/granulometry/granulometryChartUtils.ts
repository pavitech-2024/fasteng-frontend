import { useMemo } from 'react';
export const createGranulometryCurve = (
  data: [number, number][], 
): [number, number][] => {
  if (!data || data.length < 2) return data || [];
  
  // APENAS OS PONTOS ORIGINAIS - SEM PONTOS EXTRAS!
  return [...data].sort((a, b) => a[0] - b[0]);
};

// Hook SIMPLES
export const useGranulometryCurve = (
  graphData: [number, number][], 
) => {
  return useMemo(() => {
    if (!graphData || graphData.length < 2) return graphData || [];
    return createGranulometryCurve(graphData);
  }, [graphData]);
};

// 👇 CORRIGINDO AS FUNÇÕES ANTIGAS

// Função antiga CORRIGIDA
export const smoothGranulometryData = (
  data: [number, number][], 
  tension: number = 0.4, // 👈 PARÂMETRO NÃO USADO (mantido para compatibilidade)
  samples: number = 100  // 👈 PARÂMETRO NÃO USADO
): [number, number][] => {
  if (!data || data.length < 2) return data || [];
  return createGranulometryCurve(data); // 👈 SÓ 1 ARGUMENTO!
};

// Hook antigo CORRIGIDO
export const useSmoothedGranulometry = (
  graphData: [number, number][], 
  smoothingMethod: 'cubic' | 'rolling' = 'cubic', // 👈 PARÂMETRO NÃO USADO
  tension: number = 0.4 // 👈 PARÂMETRO NÃO USADO
) => {
  return useGranulometryCurve(graphData); // 👈 SÓ 1 ARGUMENTO!
};

// Funções auxiliares (se ainda precisar)
export const smoothWithRollingWindow = (
  data: [number, number][], 
  windowSize: number = 2
): [number, number][] => {
  if (!data) return [];
  const xValues = data.map(d => d[0]);
  const yValues = data.map(d => d[1]);
  
  const smoothedY = rollingWindow(yValues, windowSize).media;
  
  return xValues.map((x, i) => [x, smoothedY[i]]);
};

export const rollingWindow = (arr: number[], window: number) => {
  const media: number[] = [];
  const std: number[] = [];
  
  if (!arr) return { media: [], std: [] };
  
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1); 
    const m = slice.reduce((a, b) => a + b, 0) / slice.length; 
    media.push(m);
  }
  
  return { media, std };
};