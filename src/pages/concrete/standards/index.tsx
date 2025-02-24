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

<<<<<<< HEAD

interface ConcreteStandardsProps {
  standards: Standard[];
  filterOptions: FilterOption[];
}

export const getStaticProps = async () => {
=======
const ConcreteStandards: NextPage = () => {
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
  const standards: Standard[] = [
    {
      title: t('chapman'),
      icon: SpecifyMassIcon,
      key: 'chapman',
      standard: 'DNER - ME 194/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_194_98.pdf',
    },
    {
      title: t('coarseAggregate'),
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
      title: t('sandIncrease'),
      icon: SandIncreaseIcon,
      key: 'sandIncrease',
      standard: 'DNER - ME 192/97',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_192_97.pdf',
    },
    {
      title: t('unitMass'),
      icon: UnitMassIcon,
      key: 'unitMass',
      standard: 'DNIT 437/2022 – ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_437_2022_me.pdf',
    },
  ];

<<<<<<< HEAD
  /*const filterOptions: FilterOption[] = [
    { key: 'all', title: 'Todos', isSelected: true },
    { key: 'aggregates', title: 'Agregados', isSelected: false },
    { key: 'asphaltMix', title: 'Misturas Asfálticas', isSelected: false },
    { key: 'asphaltBinder', title: 'Ligante Asfáltico', isSelected: false },
  ];*/

  return {
    props: {
      standards,
      //filterOptions,
    },
  };
=======
  const filterOptions: FilterOption[] = [{ key: 'all', title: t('all'), isSelected: true }];

  return <StandardsTemplate standards={standards} filterOptions={filterOptions} />;
>>>>>>> 5e294e0adfc76eab4b91977a30ee47890e9a506d
};

export default ConcreteStandards;
