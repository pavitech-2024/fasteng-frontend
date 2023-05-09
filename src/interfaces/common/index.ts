import { StaticImageData } from 'next/image';

export type Essay = {
  key: string;
  title: string;
  icon: StaticImageData;
  link: string;
  type?: string;
};

export type Sieve = {
  label: string;
  value: number; // mm
};

// type AllSieves = [
//   {
//     label: '3 pol - 75 mm';
//     value: 75; // mm
//   },
//   {
//     label: '2 1/2 pol - 64mm';
//     value: 64; // mm
//   },
//   {
//     label: '2 pol - 50mm';
//     value: 50; // mm
//   },
//   {
//     label: '1 1/2 pol - 37,5mm';
//     value: 37.5; // mm
//   },
//   {
//     label: '1 1/4 pol - 32mm';
//     value: 32; // mm
//   },
//   {
//     label: '1 pol - 25mm';
//     value: 25; // mm
//   },
//   {
//     label: '3/4 pol - 19mm';
//     value: 19; // mm
//   },
//   {
//     label: '1/2 pol - 12,5mm';
//     value: 12.5; // mm
//   },
//   {
//     label: '3/8 pol - 9,5mm';
//     value: 9.5; // mm
//   },
//   {
//     label: '1/4 pol - 6,3mm';
//     value: 6.3; // mm
//   },
//   {
//     label: 'Nº4 - 4,8mm';
//     value: 4.8; // mm
//   },
//   {
//     label: 'Nº8 - 2,4mm';
//     value: 2.4; // mm
//   },
//   {
//     label: 'Nº10 - 2,0mm';
//     value: 2.0; // mm
//   },
//   {
//     label: 'Nº16 - 1,2mm';
//     value: 1.2; // mm
//   },
//   {
//     label: 'Nº30 - 0,6mm';
//     value: 0.6; // mm
//   },
//   {
//     label: 'Nº40 - 0,43mm';
//     value: 0.43; // mm
//   },
//   {
//     label: 'Nº50 - 0,3mm';
//     value: 0.3; // mm
//   },
//   {
//     label: 'Nº80 - 0,18mm';
//     value: 0.18; // mm
//   },
//   {
//     label: 'Nº100 - 0,15mm';
//     value: 0.15; // mm
//   },
//   {
//     label: 'Nº200 - 0,075mm';
//     value: 0.075; // mm
//   }
// ];
