export function calculateBands(nominalSize: number | string) {
  const size = typeof nominalSize === 'string' ? parseFloat(nominalSize) : nominalSize;

  if (size === 12.5 || size === 12.7) {
    return {
      letter: 'B',
      lower: [100, 90, 75, 55, 35, 15, 5, 2],
      higher: [100, 100, 95, 80, 60, 30, 10, 6],
    };
  }

  return { letter: null, lower: [], higher: [] };
}
