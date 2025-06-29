import { NextPage } from 'next';
import { EssaysTemplate } from '@/components/templates/essays';
import { FilterOption } from '@/components/molecules/buttons/filter';
import { t } from 'i18next';
import { AbrasionIcon, AdhesivenessIcon, DuctilityIcon, AngularityIcon, PenetrationIcon, RtfoIcon, SandEquivalentIcon, GranulometryIcon, ShapeIndexIcon, SpecifyMassIcon, ElongatedParticlesIcon, SofteningPointIcon, FlashPointIcon, ElasticRecoveryIcon, RotationalIcon, SayboltFurolIcon, RtcdIcon, FwdIcon, DduiIcon, IggIcon } from '@/assets';
import { Essay } from '@/interfaces/common';

const AsphaltEssays: NextPage = () => {

  const essays: Essay[] = [
  {
    title: t('asphalt.essays.abrasion'),
    icon: AbrasionIcon,
    key: 'abrasion',
    link: '/asphalt/essays/abrasion',
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
    link: '/asphalt/essays/sandEquivalent',
    type: 'aggregates',
  },
  {
    title: t('asphalt.essays.granulometry'),
    icon: GranulometryIcon,
    key: 'granulometry',
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
    link: '/asphalt/essays/softeningPoint',
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
    link: '/asphalt/essays/elasticRecovery',
    type: 'asphaltBinder',
  },
  {
    title: t('asphalt.essays.viscosityRotational'),
    icon: RotationalIcon,
    key: 'rotational',
    link: '/asphalt/essays/viscosityRotational',
    type: 'asphaltBinder',
  },
  {
    title: t('asphalt.essays.saybolt'),
    icon: SayboltFurolIcon,
    key: 'saybolt',
    link: '/asphalt/essays/sayboltFurol',
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
    type: 'highwaySection',
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
    type: 'highwaySection',
  },
];

  const filterOptions: FilterOption[] = [
    { key: 'all', title: t('asphalt.essays.filter.all'), isSelected: true },
    { key: 'aggregates', title: t('asphalt.essays.filter.aggregates'), isSelected: false },
    { key: 'highwaySection', title: t('asphalt.essays.filter.highwaySection'), isSelected: false },
    { key: 'asphaltBinder', title: t('asphalt.essays.filter.asphaltBinder'), isSelected: false },
    { key: 'asphaltMix', title: t('asphalt.essays.filter.asphaltMix'), isSelected: false },
  ];

  return <EssaysTemplate essays={essays} filterOptions={filterOptions} />;
};

export default AsphaltEssays;
