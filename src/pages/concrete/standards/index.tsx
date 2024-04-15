import {
  SpecifyMassIcon, //ChapmanIcon
  CoarseAggregateIcon,
  GranulometryIcon,
  SandIncreaseIcon,
  UnitMassIcon
} from '@/assets';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { StandardsTemplate } from '@/components/templates/standards';
import { Standard } from '@/interfaces/common';
import { t } from 'i18next';
import { NextPage } from 'next';

const ConcreteStandards: NextPage = () => {
  const standards: Standard[] = [
    {
      title: t('chapman'),
      icon: SpecifyMassIcon,
      key: 'chapman',
      standard: 'DNER - ME 194/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_194_98.pdf',
    },
    {
      title: t('coarse.aggregate'),
      icon: CoarseAggregateIcon,
      key: 'coarseAggregate',
      standard: 'DNER - ME 195/97',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner-me195-97.pdf',
    },
    {
      title: t('granulometry'),
      icon: GranulometryIcon,
      key: 'granulometry',
      standard: 'DNER - ME 083/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_083_98.pdf',
    },
    {
      title: t('sand.increase'),
      icon: SandIncreaseIcon,
      key: 'sandIncrease',
      standard: 'DNER - ME 192/97',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_192_97.pdf',
    },
    {
      title: t('unit.mass'),
      icon: UnitMassIcon,
      key: 'unitMass',
      standard: 'DNIT 437/2022 – ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_437_2022_me.pdf',
    },
  ];

  const filterOptions: FilterOption[] = [
    { key: 'all', title: t('all'), isSelected: true },
  ];

  return <StandardsTemplate standards={standards} filterOptions={filterOptions} />;
};

export default ConcreteStandards;
