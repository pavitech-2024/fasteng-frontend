import { useMemo } from 'react';

export const createGranulometryCurve = (
  data: [number, number][], 
): [number, number][] => {
  if (data.length < 2) return [];
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

// Função antiga CORRIGIDA
export const smoothGranulometryData = (
  data: [number, number][], 
): [number, number][] => {
  if (!data || data.length < 2) return [];
  return createGranulometryCurve(data); // Sem parâmetro 'tension' aqui
};

// Hook antigo CORRIGIDO
export const useSmoothedGranulometry = (
  graphData: [number, number][], 
) => {
  return useGranulometryCurve(graphData); // Apenas um argumento necessário
};

// Funções auxiliares
export const smoothWithRollingWindow = (
  data: [number, number][], 
  windowSize = 2
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
  
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1); 
    const m = slice.reduce((a, b) => a + b, 0) / slice.length; 
    media.push(m);
  }
  
  return { media, std };
};
