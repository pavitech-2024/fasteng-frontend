import { NextPage } from 'next';
import { EssaysTemplate } from '@/components/templates/essays';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { Essay } from '@/interfaces/common';
import {
  AbrasionIcon,
  AdhesivenessIcon,
  AngularityIcon,
  DduiIcon,
  DuctilityIcon,
  ElasticRecoveryIcon,
  ElongatedParticlesIcon,
  FlashPointIcon,
  FwdIcon,
  GranulometryIcon,
  IggIcon,
  PenetrationIcon,
  RotationalIcon,
  RtcdIcon,
  RtfoIcon,
  SandEquivalentIcon,
  SayboltFurolIcon,
  ShapeIndexIcon,
  SofteningPointIcon,
  SpecifyMassIcon,
} from '@/assets';
import { t } from 'i18next';

const AsphaltEssays: NextPage = () => {
  const filterOptions: FilterOption[] = [
    { key: 'all', title: t('asphalt.essays.filter.all'), isSelected: true },
    { key: 'aggregates', title: t('asphalt.essays.filter.aggregates'), isSelected: false },
    { key: 'asphaltMix', title: t('asphalt.essays.filter.asphaltMix'), isSelected: false },
    { key: 'asphaltBinder', title: t('asphalt.essays.filter.asphaltBinder'), isSelected: false },
  ];

  const essays: Essay[] = [
    {
      title: t('asphalt.essays.abrasion'),
      icon: AbrasionIcon,
      key: 'abrasion',
      link: '/asphalt/standard/abrasion',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.adhesiveness'),
      icon: AdhesivenessIcon,
      key: 'adhesiveness',
      link: '/asphalt/essays/adhesiveness',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.ductility'),
      icon: DuctilityIcon,
      key: 'ductility',
      link: '/asphalt/essays/ductility',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.angularity'),
      icon: AngularityIcon,
      key: 'angularity',
      link: '/asphalt/essays/angularity',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.penetration'),
      icon: PenetrationIcon,
      key: 'penetration',
      link: '/asphalt/essays/penetration',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.rtfo'),
      icon: RtfoIcon,
      key: 'rtfo',
      link: '/asphalt/essays/rtfo',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.sandEquivalent'),
      icon: SandEquivalentIcon,
      key: 'sandEquivalent',
      link: '/asphalt/essays/sand-equivalent',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.granulometryAsphalt'),
      icon: GranulometryIcon,
      key: 'granulometryAsphalt',
      link: '/asphalt/essays/granulometry',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.shapeIndex'),
      icon: ShapeIndexIcon,
      key: 'shapeIndex',
      link: '/asphalt/essays/shapeIndex',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.specifyMass'),
      icon: SpecifyMassIcon,
      key: 'specifyMass',
      link: '/asphalt/essays/specifyMass',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.elongatedParticles'),
      icon: ElongatedParticlesIcon,
      key: 'elongatedParticles',
      link: '/asphalt/essays/elongatedParticles',
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.softeningPoint'),
      icon: SofteningPointIcon,
      key: 'softeningPoint',
      link: '/asphalt/essays/softening-point',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.flashPoint'),
      icon: FlashPointIcon,
      key: 'flashPoint',
      link: '/asphalt/essays/flashPoint',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.elasticRecovery'),
      icon: ElasticRecoveryIcon,
      key: 'elasticRecovery',
      link: '/asphalt/essays/elastic-recovery',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.rotational'),
      icon: RotationalIcon,
      key: 'rotational',
      link: '/asphalt/essays/rotational',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.saybolt'),
      icon: SayboltFurolIcon,
      key: 'saybolt',
      link: '/asphalt/essays/saybolt-furol',
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.rtcd'),
      icon: RtcdIcon,
      key: 'rtcd',
      link: '/asphalt/essays/rtcd',
      type: 'asphaltMix',
    },
    {
      title: t('asphalt.essays.fwd'),
      icon: FwdIcon,
      key: 'fwd',
      link: '/asphalt/essays/fwd',
      type: 'asphaltMix',
    },
    {
      title: t('asphalt.essays.ddui'),
      icon: DduiIcon,
      key: 'ddui',
      link: '/asphalt/essays/ddui',
      type: 'asphaltMix',
    },
    {
      title: t('asphalt.essays.igg'),
      icon: IggIcon,
      key: 'igg',
      link: '/asphalt/essays/igg',
      type: 'asphaltMix',
    },
  ];
  return <EssaysTemplate essays={essays} filterOptions={filterOptions} />;
};

export default AsphaltEssays;
