import { NextPage } from 'next';
import { EssaysTemplate } from '@/components/templates/essays';
import { Essay } from '@/interfaces/common';
import { CompressionIcon, HbrIcon, SucsIcon } from '@/assets';
import { t } from 'i18next';
import CBR_SERVICE from '@/services/soils/essays/cbr/cbr.service';

const SoilsEssays: NextPage = () => {
  const cbr = new CBR_SERVICE();

  const essays: Essay[] = [
    { ...cbr.info, link: cbr.info.path } as Essay,
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
