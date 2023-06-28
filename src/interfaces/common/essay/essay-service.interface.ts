import { StaticImageData } from 'next/image';
import { StandardData } from '..';
import { EssayStepperData } from '@/components/atoms/stepper';

export interface IEssayService {
  info: {
    key: string;
    icon: StaticImageData;
    title: string;
    path: string;
    backend_path: string;
    steps: number;
    standard: StandardData;
    stepperData: EssayStepperData[];
  };

  handleNext(step: number, data: unknown): void;
}