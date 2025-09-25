
import { useMemo } from 'react';
import { smoothGranulometryData, smoothWithRollingWindow } from '../granulometryChartUtils';

export const useSmoothedGranulometry = (
  graphData: [number, number][], 
  smoothingMethod: 'cubic' | 'rolling' = 'cubic',
  tension: number = 0.4
) => {
  const smoothedData = useMemo(() => {
    if (!graphData || graphData.length < 3) return graphData;
    
    switch (smoothingMethod) {
      case 'cubic':
        return smoothGranulometryData(graphData, tension);
      case 'rolling':
        return smoothWithRollingWindow(graphData, 2);
      default:
        return graphData;
    }
  }, [graphData, smoothingMethod, tension]);

  return smoothedData;
};