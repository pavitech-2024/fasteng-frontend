import { StaticImageData } from "next/image";
import { StandardData } from "..";

export interface IMaterialService {
  info: {
    key: string;
    icon: StaticImageData;
    title: string;
    path: string;
    standard: StandardData;
  };
}