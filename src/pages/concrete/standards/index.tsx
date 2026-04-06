import {
  SpecifyMassIcon, //ChapmanIcon
  CoarseAggregateIcon,
  GranulometryIcon,
  SandIncreaseIcon,
  UnitMassIcon,
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
      standard: 'DNIT - ME 194/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_194_98.pdf',
    },
    {
      title: t('coarseAggregate'),
      icon: CoarseAggregateIcon,
      key: 'coarseAggregate',
      standard: 'DNIT - ME 195/97',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner-me195-97.pdf',
    },
    {
      title: t('granulometry'),
      icon: GranulometryIcon,
      key: 'granulometry',
      standard: 'DNIT - ME 083/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_083_98.pdf',
    },
    {
      title: t('sandIncrease'),
      icon: SandIncreaseIcon,
      key: 'sandIncrease',
      standard: 'DNIT - ME 192/97',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_192_97.pdf',
    },
    {
      title: t('unitMass'),
      icon: UnitMassIcon,
      key: 'unitMass',
      standard: 'DNIT 437/2022 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_437_2022_me.pdf',
    },
  ];

  const filterOptions: FilterOption[] = [{ key: 'all', title: t('all'), isSelected: true }];

  return <StandardsTemplate standards={standards} filterOptions={filterOptions} />;
};

export default ConcreteStandards;
