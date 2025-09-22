// hooks/useCurrentEssayData.ts
import { useMemo } from 'react';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { ResultCardData, EssayTableRow } from '../types/asphalt-granulometry.types';
import { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

export const useCurrentEssayData = () => {
  const { results: granulometry_results, step2Data, generalData } = useAsphaltGranulometryStore();

  const currentData = useMemo(() => {
    const container_other_data: ResultCardData[] = [];
    
    if (granulometry_results) {
      container_other_data.push(
        {
          label: t('granulometry-asphalt.accumulated-retained'),
          value: granulometry_results.accumulated_retained,
          unity: '%',
        },
        { label: t('granulometry-asphalt.total-retained'), value: granulometry_results.total_retained, unity: 'g' },
        {
          label: t('asphalt.essays.granulometry.results.nominalSize'),
          value: granulometry_results.nominal_size,
          unity: 'mm',
        },
        {
          label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
          value: granulometry_results.nominal_diameter,
          unity: 'mm',
        },
        {
          label: t('asphalt.essays.granulometry.results.finenessModule'),
          value: granulometry_results.fineness_module,
          unity: '%',
        },
        { label: t('granulometry-asphalt.cc'), value: granulometry_results.cc, unity: '' },
        { label: t('granulometry-asphalt.cnu'), value: granulometry_results.cnu, unity: '' },
        { label: t('granulometry-asphalt.error'), value: granulometry_results.error, unity: '%' }
      );
    }

    return { container_other_data };
  }, [granulometry_results]);

  const experimentResumeData: ExperimentResumeData = useMemo(() => ({
    experimentName: generalData.name,
    materials: [{ name: generalData.material.name, type: generalData.material.type }],
  }), [generalData]);

  const graph_data = useMemo(() => [
    [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
    ...(granulometry_results?.graph_data || []),
  ], [granulometry_results]);

  const rows: EssayTableRow[] = useMemo(() => 
    granulometry_results ? step2Data.table_data.map((value, index) => ({
      sieve: value.sieve_label,
      passant_porcentage: value.passant,
      passant: granulometry_results.passant[index][1],
      retained_porcentage: granulometry_results.retained_porcentage[index][1],
      retained: value.retained,
      accumulated_retained: granulometry_results.accumulated_retained[index][1],
    })) : [], [granulometry_results, step2Data]
  );

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'sieve',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry-asphalt.passant') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-asphalt.passant') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry-asphalt.retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained',
      headerName: t('granulometry-asphalt.retained') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry-asphalt.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ], []);

  return {
    currentData,
    experimentResumeData,
    graph_data,
    rows,
    columns,
    granulometry_results,
  };
};