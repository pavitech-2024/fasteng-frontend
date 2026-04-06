// hook/useEssayModalData.ts
import { useMemo } from 'react';
import { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

// Mapeamento de todos os tipos de ensaio
const ESSAY_TYPES = {
  // Agregados
  GRANULOMETRY: 'granulometry',
  SPECIFIC_MASS: 'specificMass',
  ADHESIVENESS: 'adhesiveness',
  ELONGATED_PARTICLES: 'elongatedParticles',
  SHAPE_INDEX: 'shapeIndex',
  ABRASION: 'abrasion',
  LOS_ANGELES_ABRASION: 'losAngelesAbrasion',
  SAND_EQUIVALENT: 'sandEquivalent',
  ANGULARITY: 'angularity',
  
  // Ligantes asfálticos
  DUCTILITY: 'ductility',
  PENETRATION: 'penetration',
  SOFTENING_POINT: 'softeningPoint',
  FLASH_POINT: 'flashPoint',
  VISCOSITY_ROTATIONAL: 'viscosityRotational',
  RTFO: 'rtfo',
  ELASTIC_RECOVERY: 'elasticRecovery',
  
  // Outros
  DOSAGE: 'dosage',
  REAL_DENSITY: 'realDensity',
  FWD: 'fwd',
  IGG: 'igg',
  RTCD: 'rtcd',
  DDUi: 'ddui',
};

// Mapeamento de essayName para tipo
const ESSAY_NAME_MAP: Record<string, string> = {
  'losAngelesAbrasion': ESSAY_TYPES.LOS_ANGELES_ABRASION,
  'specificMass': ESSAY_TYPES.SPECIFIC_MASS,
  'adhesiveness': ESSAY_TYPES.ADHESIVENESS,
  'elongatedParticles': ESSAY_TYPES.ELONGATED_PARTICLES,
  'shapeIndex': ESSAY_TYPES.SHAPE_INDEX,
  'sandEquivalent': ESSAY_TYPES.SAND_EQUIVALENT,
  'angularity': ESSAY_TYPES.ANGULARITY,
  'ductility': ESSAY_TYPES.DUCTILITY,
  'penetration': ESSAY_TYPES.PENETRATION,
  'softeningPoint': ESSAY_TYPES.SOFTENING_POINT,
  'flashPoint': ESSAY_TYPES.FLASH_POINT,
  'viscosityRotational': ESSAY_TYPES.VISCOSITY_ROTATIONAL,
  'rtfo': ESSAY_TYPES.RTFO,
  'elasticRecovery': ESSAY_TYPES.ELASTIC_RECOVERY,
  'granulometry': ESSAY_TYPES.GRANULOMETRY,
};

export const useEssayModalData = (essay: any) => {
  // Detectar o tipo de ensaio baseado no essayName ou nas propriedades
  const essayType = useMemo(() => {
    // Primeiro, tenta detectar pelo essayName (se existir)
    if (essay.essayName && ESSAY_NAME_MAP[essay.essayName]) {
      return ESSAY_NAME_MAP[essay.essayName];
    }
    
    // Se não, tenta pelas propriedades do results
    // Los Angeles Abrasion
    if (essay.results?.losAngelesAbrasion !== undefined) {
      return ESSAY_TYPES.LOS_ANGELES_ABRASION;
    }
    // Massa Específica
    if (essay.results?.bulk_specify_mass !== undefined || essay.results?.apparent_specify_mass !== undefined) {
      return ESSAY_TYPES.SPECIFIC_MASS;
    }
    // Abrasão (fallback)
    if (essay.results?.abrasion_loss !== undefined || essay.results?.wear_loss !== undefined) {
      return ESSAY_TYPES.ABRASION;
    }
    // Adesividade
    if (essay.results?.filmDisplacement !== undefined) {
      return ESSAY_TYPES.ADHESIVENESS;
    }
    // Alongados
    if (essay.results?.elongated_percentage !== undefined) {
      return ESSAY_TYPES.ELONGATED_PARTICLES;
    }
    // Índice de Forma
    if (essay.results?.shape_index !== undefined) {
      return ESSAY_TYPES.SHAPE_INDEX;
    }
    // Equivalente de Areia
    if (essay.results?.sand_equivalent !== undefined) {
      return ESSAY_TYPES.SAND_EQUIVALENT;
    }
    // Angularidade
    if (essay.results?.angularity !== undefined) {
      return ESSAY_TYPES.ANGULARITY;
    }
    // Ductilidade
    if (essay.results?.ductility !== undefined) {
      return ESSAY_TYPES.DUCTILITY;
    }
    // Penetração
    if (essay.results?.penetration !== undefined) {
      return ESSAY_TYPES.PENETRATION;
    }
    // Ponto de Amolecimento
    if (essay.results?.softening_point !== undefined) {
      return ESSAY_TYPES.SOFTENING_POINT;
    }
    // Ponto de Fulgor
    if (essay.results?.temperature !== undefined && essay.step2Data?.ignition_temperature !== undefined) {
      return ESSAY_TYPES.FLASH_POINT;
    }
    // Viscosidade Rotacional
    if (essay.results?.viscosity !== undefined) {
      return ESSAY_TYPES.VISCOSITY_ROTATIONAL;
    }
    // RTFO
    if (essay.results?.mass_loss !== undefined || essay.results?.rtfo !== undefined) {
      return ESSAY_TYPES.RTFO;
    }
    // Recuperação Elástica
    if (essay.results?.elastic_recovery !== undefined) {
      return ESSAY_TYPES.ELASTIC_RECOVERY;
    }
    // Granulometria
    if (essay.results?.graph_data) {
      return ESSAY_TYPES.GRANULOMETRY;
    }
    return 'unknown';
  }, [essay]);

  // Título do ensaio
  const essayTitle = useMemo(() => {
    const titles: Record<string, string> = {
      [ESSAY_TYPES.SPECIFIC_MASS]: 'Massa Específica',
      [ESSAY_TYPES.ABRASION]: 'Abrasão Los Angeles',
      [ESSAY_TYPES.LOS_ANGELES_ABRASION]: 'Abrasão Los Angeles',
      [ESSAY_TYPES.ADHESIVENESS]: 'Adesividade',
      [ESSAY_TYPES.ELONGATED_PARTICLES]: 'Partículas Alongadas',
      [ESSAY_TYPES.SHAPE_INDEX]: 'Índice de Forma',
      [ESSAY_TYPES.SAND_EQUIVALENT]: 'Equivalente de Areia',
      [ESSAY_TYPES.ANGULARITY]: 'Angularidade',
      [ESSAY_TYPES.DUCTILITY]: 'Ductilidade',
      [ESSAY_TYPES.PENETRATION]: 'Penetração',
      [ESSAY_TYPES.SOFTENING_POINT]: 'Ponto de Amolecimento',
      [ESSAY_TYPES.FLASH_POINT]: 'Ponto de Fulgor',
      [ESSAY_TYPES.VISCOSITY_ROTATIONAL]: 'Viscosidade Rotacional',
      [ESSAY_TYPES.RTFO]: 'RTFO',
      [ESSAY_TYPES.ELASTIC_RECOVERY]: 'Recuperação Elástica',
      [ESSAY_TYPES.GRANULOMETRY]: 'Granulometria',
      [ESSAY_TYPES.FWD]: 'FWD',
      [ESSAY_TYPES.IGG]: 'IGG',
    };
    return titles[essayType] || 'Ensaio';
  }, [essayType]);

  // Dados do experimento (resumo)
  const modalExperimentResumeData: ExperimentResumeData = useMemo(() => ({
    experimentName: essay.generalData?.name || 'Ensaio sem nome',
    author: essay.generalData?.calculist || essay.generalData?.operator || 'Não informado',
    materials: essay.generalData?.material ? 
      [{ name: essay.generalData.material.name, type: essay.generalData.material.type }] : 
      [],
  }), [essay]);

  // Dados do modal baseados no tipo de ensaio
  const modalData = useMemo(() => {
    switch (essayType) {
      // ========== AGREGADOS ==========
      case ESSAY_TYPES.SPECIFIC_MASS:
        return {
          results: [
            { label: 'Massa específica real', value: essay.results?.bulk_specify_mass?.toFixed(2), unit: 'g/cm³' },
            { label: 'Massa específica aparente', value: essay.results?.apparent_specify_mass?.toFixed(2), unit: 'g/cm³' },
            { label: 'Absorção', value: essay.results?.absorption?.toFixed(2), unit: '%' },
          ],
          stepData: [
            { label: 'Massa seca', value: essay.step2Data?.dry_mass, unit: 'g' },
            { label: 'Massa submersa', value: essay.step2Data?.submerged_mass, unit: 'g' },
            { label: 'Massa saturada', value: essay.step2Data?.surface_saturated_mass, unit: 'g' },
          ]
        };

      case ESSAY_TYPES.ABRASION:
      case ESSAY_TYPES.LOS_ANGELES_ABRASION:
        return {
          results: [
            { label: 'Perda por abrasão', value: essay.results?.losAngelesAbrasion?.toFixed(2) || essay.results?.abrasion_loss?.toFixed(2) || essay.results?.wear_loss?.toFixed(2), unit: '%' },
            { label: 'Massa inicial', value: essay.abrasionCalc?.initialMass || essay.step2Data?.initial_mass, unit: 'g' },
            { label: 'Massa final', value: essay.abrasionCalc?.finalMass || essay.step2Data?.final_mass, unit: 'g' },
            { label: 'Graduação', value: essay.abrasionCalc?.graduation || essay.step2Data?.graduation, unit: '' },
          ],
        };

      case ESSAY_TYPES.ADHESIVENESS:
        return {
          results: [
            { label: 'Deslocamento do Filme', value: essay.results?.filmDisplacement ? 'Sim' : 'Não', unit: '' },
            { label: 'Ligante', value: essay.adhesiveness?.binder || 'Não informado', unit: '' },
          ],
        };

      case ESSAY_TYPES.ELONGATED_PARTICLES:
        return {
          results: [
            { label: 'Partículas alongadas', value: essay.results?.elongated_percentage?.toFixed(2), unit: '%' },
          ],
        };

      case ESSAY_TYPES.SHAPE_INDEX:
        return {
          results: [
            { label: 'Índice de Forma', value: essay.results?.shape_index?.toFixed(2), unit: '%' },
          ],
        };

      case ESSAY_TYPES.SAND_EQUIVALENT:
        return {
          results: [
            { label: 'Equivalente de Areia', value: essay.results?.sand_equivalent?.toFixed(2), unit: '%' },
          ],
        };

      case ESSAY_TYPES.ANGULARITY:
        return {
          results: [
            { label: 'Angularidade', value: essay.results?.angularity?.toFixed(2), unit: '%' },
          ],
        };

      // ========== LIGANTES ASFÁLTICOS ==========
      case ESSAY_TYPES.DUCTILITY:
        return {
          results: [
            { label: 'Ductilidade', value: essay.results?.ductility?.toFixed(2), unit: 'mm' },
            { label: '1ª Ruptura', value: essay.step2Data?.first_rupture_length, unit: 'mm' },
            { label: '2ª Ruptura', value: essay.step2Data?.second_rupture_length, unit: 'mm' },
            { label: '3ª Ruptura', value: essay.step2Data?.third_rupture_length, unit: 'mm' },
          ],
        };

      case ESSAY_TYPES.PENETRATION:
        return {
          results: [
            { label: 'Penetração', value: essay.results?.penetration, unit: '0.1mm' },
            { label: 'Índice de Suscetibilidade', value: essay.results?.indexOfSusceptibility?.toFixed(2), unit: '' },
          ],
          stepData: [
            { label: 'Pontos', value: essay.penetrationCalc?.points?.join(', '), unit: '' },
            { label: 'Data do experimento', value: essay.penetrationCalc?.experimentDate, unit: '' },
          ]
        };

      case ESSAY_TYPES.SOFTENING_POINT:
        return {
          results: [
            { label: 'Ponto de Amolecimento', value: essay.results?.softening_point, unit: '°C' },
          ],
        };

      case ESSAY_TYPES.FLASH_POINT:
        return {
          results: [
            { label: 'Temperatura de Ignição', value: essay.results?.temperature, unit: '°C' },
          ],
        };

      case ESSAY_TYPES.VISCOSITY_ROTATIONAL:
        return {
          results: [
            { label: 'Viscosidade', value: essay.results?.viscosity, unit: 'cP' },
            { label: 'Temperatura', value: essay.results?.temperature, unit: '°C' },
          ],
        };

      case ESSAY_TYPES.RTFO:
        return {
          results: [
            { label: 'Perda de Massa', value: essay.results?.mass_loss?.toFixed(2), unit: '%' },
          ],
        };

      case ESSAY_TYPES.ELASTIC_RECOVERY:
        return {
          results: [
            { label: 'Recuperação Elástica', value: essay.results?.elastic_recovery?.toFixed(2), unit: '%' },
          ],
        };

      // ========== GRANULOMETRIA ==========
      case ESSAY_TYPES.GRANULOMETRY:
        return {
          results: [
            { label: 'Módulo de Finura', value: essay.results?.fineness_module?.toFixed(2), unit: '%' },
            { label: 'Tamanho Nominal', value: essay.results?.nominal_size, unit: 'mm' },
            { label: 'CC', value: essay.results?.cc?.toFixed(2), unit: '' },
            { label: 'CNU', value: essay.results?.cnu?.toFixed(2), unit: '' },
            { label: 'Erro', value: essay.results?.error?.toFixed(2), unit: '%' },
          ],
          graph_data: essay.results?.graph_data || [],
          table_data: essay.step2Data?.table_data || [],
          results_data: essay.results || {},
        };

      // ========== DEFAULTS ==========
      default:
        return {
          results: [],
        };
    }
  }, [essay, essayType]);

  // Dados do gráfico (apenas para granulometria)
  const modalGraphData = useMemo(() => {
    if (essayType === ESSAY_TYPES.GRANULOMETRY && modalData.graph_data && modalData.graph_data.length > 0) {
      return [
        [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
        ...modalData.graph_data,
      ];
    }
    return [];
  }, [essayType, modalData]);

  // Linhas da tabela (apenas para granulometria)
  const modalRows = useMemo(() => {
    if (essayType === ESSAY_TYPES.GRANULOMETRY && modalData.table_data && modalData.table_data.length > 0) {
      return modalData.table_data.map((value: any, index: number) => ({
        sieve: value.sieve_label,
        passant_porcentage: value.passant,
        passant: modalData.results_data?.passant?.[index]?.[1] || 0,
        retained_porcentage: modalData.results_data?.retained_porcentage?.[index]?.[1] || 0,
        retained: value.retained,
        accumulated_retained: modalData.results_data?.accumulated_retained?.[index]?.[1] || 0,
      }));
    }
    return [];
  }, [essayType, modalData]);

  // Colunas da tabela (apenas para granulometria)
  const modalColumns: GridColDef[] = useMemo(() => {
    if (essayType !== ESSAY_TYPES.GRANULOMETRY) return [];
    
    return [
      { field: 'sieve', headerName: t('granulometry-asphalt.sieves'), width: 120 },
      { field: 'passant_porcentage', headerName: t('granulometry-asphalt.passant') + ' (%)', width: 120 },
      { field: 'passant', headerName: t('granulometry-asphalt.passant') + ' (g)', width: 120 },
      { field: 'retained_porcentage', headerName: t('granulometry-asphalt.retained') + ' (%)', width: 120 },
      { field: 'retained', headerName: t('granulometry-asphalt.retained') + ' (g)', width: 120 },
      { field: 'accumulated_retained', headerName: t('granulometry-asphalt.accumulated-retained') + ' (%)', width: 150 },
    ];
  }, [essayType]);

  const stepData = useMemo(() => {
    return modalData.stepData || [];
  }, [modalData]);

  return {
    essayType,
    essayTitle,
    modalData: modalData.results || [],
    modalExperimentResumeData,
    modalGraphData,
    modalRows,
    modalColumns,
    stepData,
    hasGraph: essayType === ESSAY_TYPES.GRANULOMETRY && modalGraphData.length > 1,
    hasTable: essayType === ESSAY_TYPES.GRANULOMETRY && modalRows.length > 0,
    hasStepData: stepData.length > 0,
    generalData: essay.generalData,
    step2Data: essay.step2Data,
    results: essay.results,
  };
};