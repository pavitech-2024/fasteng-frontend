import { AllSieves, Sieve } from '../interfaces/common';

/* Example:
    value: 2 // em mm

    return N° 10 - 2.00 mm 

*/
export const getSieveName = (value: number): string => AllSieves.find((sieve: Sieve) => sieve.value === value).label;
