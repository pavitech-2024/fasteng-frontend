import { CbrIcon, CompressionIcon, GranulometryIcon } from '@/assets';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { StandardsTemplate } from '@/components/templates/standards';
import { Standard } from '@/interfaces/common';
import { t } from 'i18next';
import { NextPage } from 'next';

const SoilsStandards: NextPage = () => {
  const standards: Standard[] = [
    {
      //title: t('cbr'), 
      title: 'California Bearing Ratio - CBR - DNIT 172/2016 - ME',
      icon: CbrIcon,
      key: 'cbr',
      standard: 'DNIT 172/2016 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_172_2016_me-1.pdf',
    },
    {
      //title: t('compression'),
      title: 'Ensaio de Compactação - DNER - ME 162/94',
      icon: CompressionIcon,
      key: 'compression',
      standard: 'DNER - ME 162/94',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_162_94.pdf',
    },
    {
      //title: t('granulometry'),
      title: 'Granulometria por Peneiramento - DNER - ME 083/98',
      icon: GranulometryIcon,
      key: 'granulometry',
      standard: 'DNER - ME 083/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_083_98.pdf',
    },
  ];

  const filterOptions: FilterOption[] = [{ key: 'all', title: t('all'), isSelected: true }];
  return <StandardsTemplate standards={standards} filterOptions={filterOptions} />;
};

export default SoilsStandards;
