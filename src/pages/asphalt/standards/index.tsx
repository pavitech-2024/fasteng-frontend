import { AbrasionIcon, AdhesivenessIcon, DuctilityIcon, AngularityIcon, PenetrationIcon, RtfoIcon, SandEquivalentIcon, GranulometryIcon, ShapeIndexIcon, SpecifyMassIcon, ElongatedParticlesIcon, SofteningPointIcon, FlashPointIcon, ElasticRecoveryIcon, RotationalIcon, SayboltFurolIcon, RtcdIcon, FwdIcon, DduiIcon, IggIcon, InducedMoistureDamageIcon, DurabilityIcon, CantabrianIcon, FatigueIcon, MarshallIcon, MarshallIconPng, StorageStabilityIcon, FlowNumberIcon, MSCRIcon, ResiliencyModuleIcon } from "@/assets";
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
      standard: 'DNER - ME 035/98',
      link: 'https://smartdoser.fastengapp.com.br/static/media/AbrasaoLosAngeles03598.0fb55fd3.pdf',
      type: 'aggregates',
    },
    {
      title: 'Adesividade',
      icon: AdhesivenessIcon,
      key: 'adhesiveness',
      standard: 'DNER- ME 078/94',
      link: 'http://smartdoser.fastengapp.com.br/static/media/AdesividadeDnitme07894.b8c14e56.pdf',
      type: 'aggregates',
    },
    {
      title: 'Dano por Umidade Induzida',
      icon: InducedMoistureDamageIcon,
      key: 'inducedMoistureDamage',
      standard: 'DNIT 180/2018 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_180_2018_me-1.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ductilidade',
      icon: DuctilityIcon,
      key: 'ductility',
      standard: 'DNER - ME 163/98',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_180_2018_me-1.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Durabilidade',
      icon: DurabilityIcon,
      key: 'durability',
      standard: 'DNER - ME 089/94',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_089_94.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ensaio Cântabro',
      icon: CantabrianIcon,
      key: 'cantabrian',
      standard: 'DNER - ME 383/99',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_383_99.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ensaio de Angularidade',
      icon: AngularityIcon,
      key: 'angularity',
      standard: 'DNER - ME 415/2019',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit415_2019_me.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ensaio de Fadiga',
      icon: FatigueIcon,
      key: 'fatigue',
      standard: 'DNIT - ME 183/2018',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_183_2018_me-1.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Ensaio de Penetração',
      icon: PenetrationIcon,
      key: 'penetration',
      standard: 'DNIT - ME 155/2010',
      link: 'https://smartdoser.fastengapp.com.br/static/media/DuctilidadeDnerMe16398.a7e9de87.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Ensaio Marshall',
      icon: MarshallIconPng,
      key: 'marshall',
      standard: 'DNER - ME 043/95',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_043_95.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Equivalente Areia',
      icon: SandEquivalentIcon,
      key: 'sandEquivalent',
      standard: 'DNER - ME 054/97',
      link: 'https://smartdoser.fastengapp.com.br/static/media/EquivalenteAreiaDNERME05497.a8d7e948.pdf',
      type: 'aggregates',
    },
    {
      title: 'Estabilidade à Estocagem',
      icon: StorageStabilityIcon,
      key: 'storageStability',
      standard: 'DNER - ME 384/99',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_384_99.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Deflectômetro de Queda de Peso',
      icon: FwdIcon,
      key: 'fallingWeightDeflectometer',
      standard: 'DNER-PRO 273/96',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_184_2018_me-1.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Número de Fluxo',
      icon: FlowNumberIcon,
      key: 'flowNumber',
      standard: 'DNIT 184/2018',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/procedimento-pro/dner_pro_273_96.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Fluência e Recuperação Sob Tensões Múltiplas (MSCR)',
      icon: MSCRIcon,
      key: 'flowNumber',
      standard: 'DNIT 423/2020 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_423_2020_me.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Granulometria por Peneiramento',
      icon: GranulometryIcon,
      key: 'granulometry-asphalt',
      standard: 'DNER - ME 083/98',
      link: '/asphalt/essays/granulometry',
      type: 'aggregates',
    },
    {
      title: 'Índice de Forma',
      icon: ShapeIndexIcon,
      key: 'shapeIndex',
      standard: 'DNIT 424/2020 - ME',
      link: '/asphalt/essays/shape-index',
      type: 'aggregates',
    },
    {
      title: 'Massa Específica - Agregado Graúdo',
      icon: SpecifyMassIcon,
      key: 'specifyMassBigAggregates',
      standard: 'DNIT 413/2021 - ME',
      link: '/asphalt/essays/specify-mass',
      type: 'aggregates',
    },
    {
      title: 'Massa Específica - Agregado Miúdo',
      icon: SpecifyMassIcon,
      key: 'specifyMassSmallAggregates',
      standard: 'DNIT 411/2021 - ME',
      link: '/asphalt/essays/specify-mass',
      type: 'aggregates',
    },
    {
      title: 'Módulo de Resiliência',
      icon: ResiliencyModuleIcon,
      key: 'resilienceModule',
      standard: 'DNIT 135/2018',
      link: '/asphalt/essays/specify-mass',
      type: 'asphaltMix',
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