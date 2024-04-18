import { Box } from '@mui/material';
import { EssayPageProps } from '@/components/templates/essay';
import useFwdStore from '@/stores/asphalt/fwd/fwd.store';
import React from 'react';
import PreviewFwdTable from './tables/preview-table.fwd';
import Step4FwdTable from './tables/step4Table.fwd';

const Fwd_Step4 = ({ setNextDisabled }: EssayPageProps) => {
  const { fwdStep3, results } = useFwdStore();
  const { spreadsheetData } = fwdStep3;
  const tableData2 = results.processedData.map((row, index) => ({ 
    id: index,
    ...row,
  }));
  setNextDisabled(false);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {spreadsheetData.length > 0 && (
        <React.Fragment>
          <PreviewFwdTable rows={spreadsheetData} />
          <Step4FwdTable rows={tableData2} />
          <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem' }}>
            *Valores arredondados para melhor visualização
          </p>
        </React.Fragment>
      )}
    </Box>
  );
};

export default Fwd_Step4;
