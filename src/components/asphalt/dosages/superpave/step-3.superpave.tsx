import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import Graph from '@/services/asphalt/dosages/superpave/graph/graph';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Button } from '@mui/material';
import { GridColDef } from "@mui/x-data-grid";
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Step3InputTable from './tables/step-3-input-table';
import Step3Table from './tables/step-3-table';

const Superpave_Step3 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { calculateGranulometryComposition } = new Superpave_SERVICE();
  const { granulometryCompositionData: data, materialSelectionData, setData, generalData } = useSuperpaveStore();
  const [selectedCurves, setSelectedCurves] = useState([]);

  useEffect(() => {
    if (generalData.dnitBand) {
      const insertingDnitBand = {
        ...data,
        dnitBands: generalData.dnitBand,
      };
      setData({ step: 2, value: insertingDnitBand });
    }
  }, [generalData]);

  // Definindo as colunas para tabela de dados
  const columns: GridColDef[] = [];
  const columnGrouping = [];

  const handleToggleCurve = (curveType) => {
    // Método para gerenciar curvas selecionadas
    setSelectedCurves((prevCurves) => {
      if (prevCurves.includes(curveType)) {
        return prevCurves.filter((curve) => curve !== curveType);
      } else {
        return [...prevCurves, curveType];
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => handleToggleCurve('lower')}
            sx={{ color: selectedCurves.includes('lower') ? 'secondaryTons.orange' : '' }}
          >
            {t('asphalt.dosages.superpave.lower_curve')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleToggleCurve('average')}
            sx={{ color: selectedCurves.includes('average') ? 'secondaryTons.orange' : '' }}
          >
            {t('asphalt.dosages.superpave.average_curve')}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleToggleCurve('higher')}
            sx={{ color: selectedCurves.includes('higher') ? 'secondaryTons.orange' : '' }}
          >
            {t('asphalt.dosages.superpave.higher_curve')}
          </Button>
        </Box>

        {/* Definindo as rows para a tabela de dados de acordo com as curvas selecionadas */}
        {selectedCurves.map((curveType) => (
          <div key={`${curveType}-tables`}>
            <Step3Table
              key={`${curveType}-table`}
              rows={data?.table_data[`table_rows_${curveType}`]}
              columns={columns}
              columnGrouping={columnGrouping}
              superpave={superpave}
            />
            
            <Step3InputTable
              key={`${curveType}-input-table`}
              rows={data?.table_data[`table_rows_${curveType}`]}
              columns={columns} superpave={new Superpave_SERVICE}
            />
          </div>
        ))}
        {data?.graphData?.length > 1 && <Graph data={data?.graphData} />}
      </Box>
    </>
  );
};

export default Superpave_Step3;
