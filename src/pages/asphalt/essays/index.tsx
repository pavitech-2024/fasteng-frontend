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
import useAbrasionStore from '@/stores/asphalt/abrasion/abrasion.store';
import useAdhesivenessStore from '@/stores/asphalt/adhesiveness/adhesiveness.store';
import useDuctilityStore from '@/stores/asphalt/ductility/ductility.store';
import useAngularityStore from '@/stores/asphalt/angularity/angularity.store';
import usePenetrationStore from '@/stores/asphalt/penetration/penetration.store';
import useRtfoStore from '@/stores/asphalt/rtfo/rtfo.store';
import useSandEquivalentStore from '@/stores/asphalt/sandEquivalent/sandEquivalent.store';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import useShapeIndexStore from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import useElongatedParticlesStore from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import useSpecifyMassStore from '@/stores/asphalt/specifyMass/specifyMass.store';
import useSofteningPointStore from '@/stores/asphalt/softeningPoint/softeningPoint.store';
import useFlashPointStore from '@/stores/asphalt/flashPoint/flashPoint.store';
import useElasticRecoveryStore from '@/stores/asphalt/elasticRecovery/elasticRecovery.store';
import useViscosityRotationalStore from '@/stores/asphalt/viscosityRotational/viscosityRotational.store';
import useSayboltFurolStore from '@/stores/asphalt/sayboltFurol/sayboltFurol.store';
import useRtcdStore from '@/stores/asphalt/rtcd/rtcd.store';
import useFwdStore from '@/stores/asphalt/fwd/fwd.store';
import useDduiStore from '@/stores/asphalt/ddui/ddui.store';
import useIggStore from '@/stores/asphalt/igg/igg.store';

const AsphaltEssays: NextPage = () => {
  const filterOptions: FilterOption[] = [
    { key: 'all', title: t('asphalt.essays.filter.all'), isSelected: true },
    { key: 'aggregates', title: t('asphalt.essays.filter.aggregates'), isSelected: false },
    { key: 'highwaySection', title: t('asphalt.essays.filter.highwaySection'), isSelected: false },
    { key: 'asphaltBinder', title: t('asphalt.essays.filter.asphaltBinder'), isSelected: false },
    { key: 'asphaltMix', title: t('asphalt.essays.filter.asphaltMix'), isSelected: false },
  ];

  const essays: Essay[] = [
    {
      title: t('asphalt.essays.abrasion'),
      icon: AbrasionIcon,
      key: 'abrasion',
      link: '/asphalt/essays/abrasion',
      store: useAbrasionStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.adhesiveness'),
      icon: AdhesivenessIcon,
      key: 'adhesiveness',
      link: '/asphalt/essays/adhesiveness',
      store: useAdhesivenessStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.ductility'),
      icon: DuctilityIcon,
      key: 'ductility',
      link: '/asphalt/essays/ductility',
      store: useDuctilityStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.angularity'),
      icon: AngularityIcon,
      key: 'angularity',
      link: '/asphalt/essays/angularity',
      store: useAngularityStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.penetration'),
      icon: PenetrationIcon,
      key: 'penetration',
      link: '/asphalt/essays/penetration',
      store: usePenetrationStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.rtfo'),
      icon: RtfoIcon,
      key: 'rtfo',
      link: '/asphalt/essays/rtfo',
      store: useRtfoStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.sandEquivalent'),
      icon: SandEquivalentIcon,
      key: 'sandEquivalent',
      link: '/asphalt/essays/sandEquivalent',
      store: useSandEquivalentStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.granulometry'),
      icon: GranulometryIcon,
      key: 'granulometry',
      link: '/asphalt/essays/granulometry',
      store: useAsphaltGranulometryStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.shapeIndex'),
      icon: ShapeIndexIcon,
      key: 'shapeIndex',
      link: '/asphalt/essays/shapeIndex',
      store: useShapeIndexStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.specifyMass'),
      icon: SpecifyMassIcon,
      key: 'specifyMass',
      link: '/asphalt/essays/specifyMass',
      store: useSpecifyMassStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.elongatedParticles'),
      icon: ElongatedParticlesIcon,
      key: 'elongatedParticles',
      link: '/asphalt/essays/elongatedParticles',
      store: useElongatedParticlesStore(),
      type: 'aggregates',
    },
    {
      title: t('asphalt.essays.softeningPoint'),
      icon: SofteningPointIcon,
      key: 'softeningPoint',
      link: '/asphalt/essays/softeningPoint',
      store: useSofteningPointStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.flashPoint'),
      icon: FlashPointIcon,
      key: 'flashPoint',
      link: '/asphalt/essays/flashPoint',
      store: useFlashPointStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.elasticRecovery'),
      icon: ElasticRecoveryIcon,
      key: 'elasticRecovery',
      link: '/asphalt/essays/elasticRecovery',
      store: useElasticRecoveryStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.viscosityRotational'),
      icon: RotationalIcon,
      key: 'rotational',
      link: '/asphalt/essays/viscosityRotational',
      store: useViscosityRotationalStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.saybolt'),
      icon: SayboltFurolIcon,
      key: 'saybolt',
      link: '/asphalt/essays/sayboltFurol',
      store: useSayboltFurolStore(),
      type: 'asphaltBinder',
    },
    {
      title: t('asphalt.essays.rtcd'),
      icon: RtcdIcon,
      key: 'rtcd',
      link: '/asphalt/essays/rtcd',
      store: useRtcdStore(),
      type: 'asphaltMix',
    },
    {
      title: t('asphalt.essays.fwd'),
      icon: FwdIcon,
      key: 'fwd',
      link: '/asphalt/essays/fwd',
      store: useFwdStore(),
      type: 'highwaySection',
    },
    {
      title: t('asphalt.essays.ddui'),
      icon: DduiIcon,
      key: 'ddui',
      link: '/asphalt/essays/ddui',
      store: useDduiStore(),
      type: 'asphaltMix',
    },
    {
      title: t('asphalt.essays.igg'),
      icon: IggIcon,
      key: 'igg',
      link: '/asphalt/essays/igg',
      store: useIggStore(),
      type: 'highwaySection',
    },
  ];
  return <EssaysTemplate essays={essays} filterOptions={filterOptions} />;
};

export default AsphaltEssays;
