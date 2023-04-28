import { AbrasionIcon, AdhesivenessIcon, DuctilityIcon, AngularityIcon, PenetrationIcon, RtfoIcon, SandEquivalentIcon, GranulometryIcon, ShapeIndexIcon, SpecifyMassIcon, ElongatedParticlesIcon, SofteningPointIcon, FlashPointIcon, ElasticRecoveryIcon, RotationalIcon, SayboltFurolIcon, RtcdIcon, FwdIcon, DduiIcon, IggIcon, InducedMoistureDamageIcon, DurabilityIcon } from "@/assets";
import { FilterOption } from "@/components/molecules/buttons/filter";
import { StandardsTemplate } from "@/components/templates/standards";
import { Standard } from "@/interfaces/common";
import { NextPage } from "next";

interface AsphaltStandardsProps {
  standards: Standard[];
  filterOptions: FilterOption[];
}

export const getStaticProps = async () => {
  const standards: Standard[] = [
    {
      title: 'Abrasão "Los Angeles"',
      icon: AbrasionIcon,
      key: 'abrasion',
      link: 'https://smartdoser.fastengapp.com.br/static/media/AbrasaoLosAngeles03598.0fb55fd3.pdf',
      type: 'aggregates',
    },
    {
      title: 'Adesividade',
      icon: AdhesivenessIcon,
      key: 'adhesiveness',
      link: 'http://smartdoser.fastengapp.com.br/static/media/AdesividadeDnitme07894.b8c14e56.pdf',
      type: 'aggregates',
    },
    {
      title: 'Dano por Umidade Induzida',
      icon: InducedMoistureDamageIcon,
      key: 'inducedMoistureDamage',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_180_2018_me-1.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ductilidade',
      icon: DuctilityIcon,
      key: 'ductility',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_180_2018_me-1.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Durabilidade',
      icon: DurabilityIcon,
      key: 'ductility',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_180_2018_me-1.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Ensaio de Angularidade',
      icon: AngularityIcon,
      key: 'angularity',
      link: 'https://smartdoser.fastengapp.com.br/static/media/DuctilidadeDnerMe16398.a7e9de87.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ensaio de Penetração',
      icon: PenetrationIcon,
      key: 'penetration',
      link: 'https://smartdoser.fastengapp.com.br/static/media/DuctilidadeDnerMe16398.a7e9de87.pdf',
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

  const filterOptions: FilterOption[] = [
    { key: 'all', title: 'Todos', isSelected: true },
    { key: 'aggregates', title: 'Agregados', isSelected: false },
    { key: 'asphaltMix', title: 'Misturas Asfálticas', isSelected: false },
    { key: 'asphaltBinder', title: 'Ligante Asfáltico', isSelected: false },
  ];

  return {
    props: {
      standards,
      filterOptions,
    },
  };
};

const AsphaltStandards: NextPage = ({ standards, filterOptions }: AsphaltStandardsProps) => (
  <StandardsTemplate standards={standards} filterOptions={filterOptions} />
);

export default AsphaltStandards;