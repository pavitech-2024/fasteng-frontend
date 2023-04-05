import { NextPage } from 'next';
import React from 'react';
import { EssaysTemplate } from '../../../components/templates/essays';
import { Essay } from '@/interfaces/common';
import { CoarseAggregateIcon, GranulometryIcon, SandIncreaseIcon, SpecifyMassIcon, UnitMassIcon } from '@/assets';

export const getStaticProps = async () => {
  const essays: Essay[] = [
    {
      title: 'Granulometria por Peneiramento',
      key: 'granulometry-concrete',
      icon: GranulometryIcon,
      link: '/concrete/essays/granulometry',
    },
    {
      title: 'Massa Específica - Frasco de Chapman',
      key: 'chapman',
      icon: SpecifyMassIcon,
      link: '/concrete/essays/chapman',
    },
    { title: 'Massa Unitária', key: 'unitMass', icon: UnitMassIcon, link: '/concrete/essays/unit-mass' },
    {
      title: 'Inchamento da Areia',
      key: 'sandIncrease',
      icon: SandIncreaseIcon,
      link: '/concrete/essays/sand-increase',
    },
    {
      title: 'Massa Específica de Agregado Graúdo',
      key: '',
      icon: CoarseAggregateIcon,
      link: '/concrete/essays/coarse-aggregate',
    },
  ];

  return {
    props: {
      essays,
    },
  };
};

interface ConcreteEssaysProps {
  essays: Essay[];
}
const index: NextPage = ({ essays }: ConcreteEssaysProps) => {
  return <EssaysTemplate essays={essays} />;
};

export default index;
