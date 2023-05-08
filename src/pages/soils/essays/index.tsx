import { NextPage } from 'next';
import { EssaysTemplate } from '@/components/templates/essays';
import { Essay } from '@/interfaces/common';
import { CbrIcon, CompressionIcon, HbrIcon, SucsIcon } from '@/assets';
import { t } from 'i18next';

const SoilsEssays: NextPage = () => {
  const essays: Essay[] = [
    {
      title: t('soils.essays.cbr'),
      icon: CbrIcon,
      key: 'cbr',
      link: '/soils/essays/cbr',
    },
    {
      title: t('soils.essays.hrb'),
      icon: HbrIcon,
      key: 'hbr',
      link: '/soils/essays/hrb',
    },
    {
      title: t('soils.essays.sucs'),
      icon: SucsIcon,
      key: 'sucs',
      link: '/soils/essays/sucs',
    },
    {
      title: t('soils.essays.compression'),
      icon: CompressionIcon,
      key: 'compression',
      link: '/soils/essays/compression',
    },
  ];

  return <EssaysTemplate essays={essays} />;
};

export default SoilsEssays;
