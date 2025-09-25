// utils/granulometryChartUtils.ts

// Função para suavizar os dados de granulometria
export const smoothGranulometryData = (
  data: [number, number][], 
  tension: number = 0.4,
  samples: number = 100
): [number, number][] => {
  if (data.length < 2) return data;

  // Ordenar por diâmetro (eixo X)
  const sortedData = [...data].sort((a, b) => a[0] - b[0]);
  
  // Aplicar interpolação cúbica para suavização
  const smoothed: [number, number][] = [];
  
  // Gerar mais pontos para curva suave
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const logX = Math.log10(sortedData[0][0]) + 
                 t * (Math.log10(sortedData[sortedData.length - 1][0]) - Math.log10(sortedData[0][0]));
    const x = Math.pow(10, logX);
    
    // Interpolação linear em escala logarítmica
    let y = 0;
    for (let j = 0; j < sortedData.length - 1; j++) {
      if (x >= sortedData[j][0] && x <= sortedData[j + 1][0]) {
        const logX1 = Math.log10(sortedData[j][0]);
        const logX2 = Math.log10(sortedData[j + 1][0]);
        const logXCurrent = Math.log10(x);
        const tLocal = (logXCurrent - logX1) / (logX2 - logX1);
        
        // Suavização com tensão (similar ao tension do Chart.js)
        y = sortedData[j][1] + (sortedData[j + 1][1] - sortedData[j][1]) * 
            (tLocal + tension * Math.sin(tLocal * Math.PI));
        break;
      }
    }
    
    smoothed.push([x, y]);
  }
  
  return smoothed;
};

// Versão simplificada usando média móvel (rolling window)
export const smoothWithRollingWindow = (
  data: [number, number][], 
  windowSize: number = 2
): [number, number][] => {
  const xValues = data.map(d => d[0]);
  const yValues = data.map(d => d[1]);
  
  const smoothedY = rollingWindow(yValues, windowSize).media;
  
  return xValues.map((x, i) => [x, smoothedY[i]]);
};

// Sua função rollingWindow adaptada
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