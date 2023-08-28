import { AllSieves, Sieve, AllSieveSeries, SieveSeries } from '../interfaces/common';

/* Example:
    value: 2 // em mm

    return N° 10 - 2.00 mm 

*/
export const getSieveName = (value: number): string => AllSieves.find((sieve: Sieve) => sieve.value === value).label;

export const getSieveSeries = (index: number): SieveSeries => AllSieveSeries[index];
