import { NextPage } from 'next';
import React from 'react';
import { EssaysTemplate } from '../../../components/templates/essays';
import { Essay } from '@/interfaces/common';
import { CoarseAggregateIcon, GranulometryIcon, SandIncreaseIcon, SpecifyMassIcon, UnitMassIcon } from '@/assets';
import { t } from 'i18next';

const index: NextPage = () => {
  const essays: Essay[] = [
    {
      title: t('concrete.essays.granulometryConcrete'),
      key: 'granulometry-concrete',
      icon: GranulometryIcon,
      link: '/concrete/essays/granulometry',
    },
    {
      title: t('concrete.essays.chapman'),
      key: 'chapman',
      icon: SpecifyMassIcon,
      link: '/concrete/essays/chapman',
    },
    {
      title: t('concrete.essays.unitMass'),
      key: 'unitMass',
      icon: UnitMassIcon,
      link: '/concrete/essays/unitMass',
    },
    {
      title: t('concrete.essays.sandIncrease'),
      key: 'sandIncrease',
      icon: SandIncreaseIcon,
      link: '/concrete/essays/sand-increase',
    },
    {
      title: t('concrete.essays.coarseAggregate'),
      key: 'coarseAggregate',
      icon: CoarseAggregateIcon,
      link: '/concrete/essays/coarse-aggregate',
    },
  ];
  return <EssaysTemplate essays={essays} />;
};

export default index;
