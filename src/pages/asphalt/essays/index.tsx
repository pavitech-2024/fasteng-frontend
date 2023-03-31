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

const AsphaltEssays: NextPage = () => {
  const filterOptions: FilterOption[] = [
    { key: 'all', title: 'Todos', isSelected: true },
    { key: 'aggregates', title: 'Agregados', isSelected: false },
    { key: 'asphaltMix', title: 'Misturas Asfálticas', isSelected: false },
    { key: 'asphaltBinder', title: 'Ligante Asfáltico', isSelected: false },
  ];

  const essays: Essay[] = [
    {
      title: 'Abrasão "Los Angeles"',
      icon: AbrasionIcon,
      key: 'abrasion',
      link: '/asphalt/essays/abrasion',
      type: 'aggregates',
    },
    {
      title: 'Adesividade',
      icon: AdhesivenessIcon,
      key: 'adhesiveness',
      link: '/asphalt/essays/adhesiveness',
      type: 'aggregates',
    },
    {
      title: 'Ductilidade',
      icon: DuctilityIcon,
      key: 'ductility',
      link: '/asphalt/essays/ductility',
      type: 'asphaltBinder',
    },
    {
      title: 'Ensaio de Angularidade',
      icon: AngularityIcon,
      key: 'angularity',
      link: '/asphalt/essays/angularity',
      type: 'aggregates',
    },
    {
      title: 'Ensaio de Penetração',
      icon: PenetrationIcon,
      key: 'penetration',
      link: '/asphalt/essays/penetration',
      type: 'asphaltBinder',
    },
    {
      title: 'Envelhecimento à Curto Prazo - RTFO',
      icon: RtfoIcon,
      key: 'rtfo',
      link: '/asphalt/essays/rtfo',
      type: 'asphaltBinder',
    },
    {
      title: 'Equivalente Areia',
      icon: SandEquivalentIcon,
      key: 'sandEquivalent',
      link: '/asphalt/essays/sand-equivalent',
      type: 'aggregates',
    },
    {
      title: 'Granulometria por Peneiramento',
      icon: GranulometryIcon,
      key: 'granulometry-asphalt',
      link: '/asphalt/essays/granulometry',
      type: 'aggregates',
    },
    {
      title: 'Índice de Forma',
      icon: ShapeIndexIcon,
      key: 'shapeIndex',
      link: '/asphalt/essays/shape-index',
      type: 'aggregates',
    },
    {
      title: 'Massa Específica',
      icon: SpecifyMassIcon,
      key: 'specifyMass',
      link: '/asphalt/essays/specify-mass',
      type: 'aggregates',
    },
    {
      title: 'Partículas Alongadas e Achatadas',
      icon: ElongatedParticlesIcon,
      key: 'elongatedParticles',
      link: '/asphalt/essays/elongated-particles',
      type: 'aggregates',
    },
    {
      title: 'Ponto de Amolecimento',
      icon: SofteningPointIcon,
      key: 'softeningPoint',
      link: '/asphalt/essays/softening-point',
      type: 'asphaltBinder',
    },
    {
      title: 'Ponto de Fulgor',
      icon: FlashPointIcon,
      key: 'flashPoint',
      link: '/asphalt/essays/flash-point',
      type: 'asphaltBinder',
    },
    {
      title: 'Recuperação Elástica',
      icon: ElasticRecoveryIcon,
      key: 'elasticRecovery',
      link: '/asphalt/essays/elastic-recovery',
      type: 'asphaltBinder',
    },
    {
      title: 'Viscosidade Rotacional',
      icon: RotationalIcon,
      key: 'rotational',
      link: '/asphalt/essays/rotational',
      type: 'asphaltBinder',
    },
    {
      title: 'Viscosidade Saybolt-Furol',
      icon: SayboltFurolIcon,
      key: 'saybolt',
      link: '/asphalt/essays/saybolt-furol',
      type: 'asphaltBinder',
    },
    {
      title: 'Resistência à Tração por Compressão Diametral - RT',
      icon: RtcdIcon,
      key: 'rtcd',
      link: '/asphalt/essays/rtcd',
      type: 'asphaltMix',
    },
    {
      title: 'Falling Weight Deflectometer - FWD',
      icon: FwdIcon,
      key: 'fwd',
      link: '/asphalt/essays/fwd',
      type: 'asphaltMix',
    },
    {
      title: 'Determinação do Dano por Umidade Induzida',
      icon: DduiIcon,
      key: 'ddui',
      link: '/asphalt/essays/ddui',
      type: 'asphaltMix',
    },
    {
      title: 'IGG',
      icon: IggIcon,
      key: 'igg',
      link: '/asphalt/essays/igg',
      type: 'asphaltMix',
    },
  ];

  return <EssaysTemplate essays={essays} filterOptions={filterOptions} />;
};

export default AsphaltEssays;
