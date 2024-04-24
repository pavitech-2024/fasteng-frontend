import {
  CbrIcon,
  CompressionIcon,
  GranulometryIcon,
  HrbIcon,
  SucsIcon,
} from '@/assets';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { StandardsTemplate } from '@/components/templates/standards';
import { Standard } from '@/interfaces/common';
import { t } from 'i18next';
import { NextPage } from 'next';

const SoilsStandards: NextPage = () => {
  const standards: Standard[] = [
    {
      title: t('cbr'),
      icon: CbrIcon,
      key: 'cbr',
      standard: 'DNIT 172/2016 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_172_2016_me-1.pdf',
    },
    {
      title: t('compression'),
      icon: CompressionIcon,
      key: 'compression',
      standard: 'DNER - ME 162/94',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_162_94.pdf',
      
    },
    {
      title: t('granulometry'),
      icon: GranulometryIcon,
      key: 'granulometry',
      standard: 'DNER - ME 083/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_083_98.pdf',
    },
    {
      title: t('hrb'),
      icon: HrbIcon,
      key: 'hrb',
      standard: '',
      link: 'src/assets/soils/tables/hrb_table_image.png',
    },
    {
      title: t('sucs'),
      icon: SucsIcon,
      key: 'sucs',
      standard: '',
      link: 'src/assets/soils/tables/sucs_table_image.jpeg',
    },
  ];

  const filterOptions: FilterOption[] = [
    { key: 'all', title: t('all'), isSelected: true },
  ];
  return <StandardsTemplate standards={standards} filterOptions={filterOptions} />;
};

export default SoilsStandards;
