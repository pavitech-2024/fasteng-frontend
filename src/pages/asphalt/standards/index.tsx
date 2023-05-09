import { AbrasionIcon, AdhesivenessIcon, DuctilityIcon, AngularityIcon, PenetrationIcon, SandEquivalentIcon, GranulometryIcon, ShapeIndexIcon, SpecifyMassIcon, ElongatedParticlesIcon, SofteningPointIcon, FlashPointIcon, ElasticRecoveryIcon, RotationalIcon, RtcdIcon, FwdIcon, InducedMoistureDamageIcon, DurabilityIcon, CantabrianIcon, FatigueIcon, MarshallIconPng, StorageStabilityIcon, FlowNumberIcon, MSCRIcon, ResiliencyModuleIcon, RiceTestIcon } from "@/assets";
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
      key: 'mscr',
      standard: 'DNIT 423/2020 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_423_2020_me.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Granulometria por Peneiramento',
      icon: GranulometryIcon,
      key: 'granulometry-asphalt',
      standard: 'DNER - ME 083/98',
      link: 'https://smartdoser.fastengapp.com.br/static/media/GranulometriaDnerMe08398.1ca0cbba.pdf',
      type: 'aggregates',
    },
    {
      title: 'Índice de Forma',
      icon: ShapeIndexIcon,
      key: 'shapeIndex',
      standard: 'DNIT 424/2020 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_424_2020_me.pdf',
      type: 'aggregates',
    },
    {
      title: 'Massa Específica - Agregado Graúdo',
      icon: SpecifyMassIcon,
      key: 'specifyMassBigAggregates',
      standard: 'DNIT 413/2021 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_413_2021_me.pdf',
      type: 'aggregates',
    },
    {
      title: 'Massa Específica - Agregado Miúdo',
      icon: SpecifyMassIcon,
      key: 'specifyMassSmallAggregates',
      standard: 'DNIT 411/2021 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_411_2021_me-1.pdf',
      type: 'aggregates',
    },
    {
      title: 'Módulo de Resiliência',
      icon: ResiliencyModuleIcon,
      key: 'resilienceModule',
      standard: 'DNIT 135/2018 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_135_2018_me-2.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Partículas Alongadas e Achatadas',
      icon: ElongatedParticlesIcon,
      key: 'elongatedParticles',
      standard: 'DNIT 429/2020 - ME',
      link: '/https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_429_2020_me-3.pdf',
      type: 'aggregates',
    },
    {
      title: 'Ponto de Amolecimento',
      icon: SofteningPointIcon,
      key: 'softeningPoint',
      standard: 'DNIT 131/2010 - ME',
      link: 'https://smartdoser.fastengapp.com.br/static/media/PontoDeAmolecimentoDNITME1312010.90d3b6e9.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Ponto de Fulgor',
      icon: FlashPointIcon,
      key: 'flashPoint',
      standard: 'DNER - ME 148/94',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dner_me_148_94.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Recuperação Elástica',
      icon: ElasticRecoveryIcon,
      key: 'elasticRecovery',
      standard: 'DNER 130/2010 - ME',
      link: 'https://smartdoser.fastengapp.com.br/static/media/RecuperacaoElasticasDnit1302010.592ab73d.pdf',
      type: 'asphaltBinder',
    },
    {
      title: 'Resistência à Tração por Compressão Diametral - RT',
      icon: RtcdIcon,
      key: 'rtcd',
      standard: 'DNIT 136/2018 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_136_2018_me-1.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Método Rice',
      icon: RiceTestIcon,
      key: 'rice',
      standard: 'DNIT 136/2018 - ME',
      link: 'https://www.gov.br/dnit/pt-br/assuntos/planejamento-e-pesquisa/ipr/coletanea-de-normas/coletanea-de-normas/metodo-de-ensaio-me/dnit_136_2018_me-1.pdf',
      type: 'asphaltMix',
    },
    {
      title: 'Viscosidade Rotacional',
      icon: RotationalIcon,
      key: 'rotational',
      standard: 'DNIT 427/2020 - ME',
      link: '',
      type: 'asphaltBinder',
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