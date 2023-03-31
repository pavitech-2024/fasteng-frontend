import { NextPage } from 'next';
import { EssaysTemplate } from '@/components/templates/essays';
import { Essay } from '@/interfaces/common';
import { CbrIcon, CompressionIcon, HbrIcon, SucsIcon } from '@/assets';

const SoilsEssays: NextPage = () => {
  const essays: Essay[] = [
    { title: 'California Bearing Ratio - CBR', icon: CbrIcon, key: 'cbr', link: '/soils/essays/cbr' },
    { title: 'Classificação Rodoviária - HRB', icon: HbrIcon, key: 'hbr', link: '/soils/essays/hrb' },
    { title: 'Classificação Unificada - SUCS', icon: SucsIcon, key: 'sucs', link: '/soils/essays/sucs' },
    { title: 'Ensaio de Compactação', icon: CompressionIcon, key: 'compression', link: '/soils/essays/compression' },
  ];

  return <EssaysTemplate essays={essays} />;
};

export default SoilsEssays;
