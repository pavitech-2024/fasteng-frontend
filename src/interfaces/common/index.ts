import { StaticImageData } from 'next/image';

export type Essay = {
  key: string;
  title: string;
  icon: StaticImageData;
  link: string;
  type?: string;
};

export type Standard = {
  key: string;
  title: string;
  icon: StaticImageData;
  link: string;
  type?: string;
  standard?: string;
};
