import { useMemo } from 'react';
import { smoothGranulometryData, smoothWithRollingWindow } from '../granulometryChartUtils';

export const useSmoothedGranulometry = (
  graphData: [number, number][], 
  smoothingMethod: 'cubic' | 'rolling' = 'cubic',
  tension =  0.4 // Esse parâmetro não é usado
) => {
  const smoothedData = useMemo(() => {
    if (!graphData || graphData.length < 3) return graphData;
    
    switch (smoothingMethod) {
      case 'cubic':
        return smoothGranulometryData(graphData); // Remover o argumento tension aqui
      case 'rolling':
        return smoothWithRollingWindow(graphData, 2); // Você pode passar o tamanho da janela como 2
      default:
        return graphData;
    }
  }, [graphData, smoothingMethod, tension]);

  return smoothedData;
};
