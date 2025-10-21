import { useMemo } from 'react';
import { GranulometryEssay } from '../types/material.types';
import { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';

export const useEssayModalData = (essay: GranulometryEssay) => {
  const modalData = useMemo(() => ({
    container_other_data: [
      {
        label: t('granulometry-asphalt.accumulated-retained'),
        value: essay.results.accumulated_retained,
        unity: '%',
      },
      { label: t('granulometry-asphalt.total-retained'), value: essay.results.total_retained, unity: 'g' },
      { label: t('asphalt.essays.granulometry.results.nominalSize'), value: essay.results.nominal_size, unity: 'mm' },
      {
        label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
        value: essay.results.nominal_diameter,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.finenessModule'),
        value: essay.results.fineness_module,
        unity: '%',
      },
      { label: t('granulometry-asphalt.cc'), value: essay.results.cc, unity: '' },
      { label: t('granulometry-asphalt.cnu'), value: essay.results.cnu, unity: '' },
      { label: t('granulometry-asphalt.error'), value: essay.results.error, unity: '%' },
    ]
  }), [essay]);

  const modalExperimentResumeData: ExperimentResumeData = useMemo(() => ({
    experimentName: essay.generalData.name,
    materials: [{ name: essay.generalData.material.name, type: essay.generalData.material.type }],
  }), [essay]);

  const modalGraphData = useMemo(() => [
    [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
    ...essay.results.graph_data,
  ], [essay]);

  const modalRows = useMemo(() => 
    essay.step2Data.table_data.map((value, index) => ({
      sieve: value.sieve_label,
      passant_porcentage: value.passant,
      passant: essay.results.passant[index]?.[1] || 0,
      retained_porcentage: essay.results.retained_porcentage[index]?.[1] || 0,
      retained: value.retained,
      accumulated_retained: essay.results.accumulated_retained[index]?.[1] || 0,
    })), [essay]
  );

  const modalColumns: GridColDef[] = useMemo(() => [
    { field: 'sieve', headerName: t('granulometry-asphalt.sieves'), valueFormatter: ({ value }) => `${value}` },
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
    modalData,
    modalExperimentResumeData,
    modalGraphData,
    modalRows,
    modalColumns,
  };
};