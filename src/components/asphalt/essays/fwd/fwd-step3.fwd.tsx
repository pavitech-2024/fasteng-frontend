import { Box, Button } from '@mui/material';
import { EssayPageProps } from '@/components/templates/essay';
import useFwdStore, { FwdStep3 } from '@/stores/asphalt/fwd/fwd.store';
import FileInput from '@/components/atoms/inputs/input-file';
import { processFile } from '@/components/util/file';
import React from 'react';
import PreviewFwdTable from './tables/preview-table.fwd';

const Fwd_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { setData } = useFwdStore();
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [, setHeader] = React.useState<string[]>([]);
  const processedFile: FwdStep3 = {
    spreadsheetData: [],
  };

  const processFwdFile = (file: any) => {
    const tempHeader: string[] = [
      'Hodometro',
      'D1',
      'D2',
      'D3',
      'D4',
      'D5',
      'D6',
      'D7',
      'D8',
      'D9',
      'D10',
      'D11',
      'D12',
      'D13',
      'Força (KN)',
    ];

    const fileWithoutUselessRows = file.slice(1, file.length);
    fileWithoutUselessRows.forEach((item) => {
      const arr: (number | null)[] = new Array(15).fill(null);
      arr[0] = item['HODOMETRO (m)'];
      arr[1] = item['LEITURAS (µm)'];
      arr[2] = item['__EMPTY'];

      let keys = Object.keys(item);
      keys = keys.slice(3, keys.length);

      let itemCount = 0;
      keys.forEach((key) => {
        const column = parseInt(key.substring('__EMPTY_'.length));
        if (column < arr.length - 3) {
          arr[column + 2] = item[key];
        }
        itemCount++;
      });

      arr[itemCount + 2] = item['FORCA DE IMPACTO (KN)'];

      const row = {
        hodometro: arr[0],
        d1: arr[1],
        d2: arr[2],
        d3: arr[3],
        d4: arr[4],
        d5: arr[5],
        d6: arr[6],
        d7: arr[7],
        d8: arr[8],
        d9: arr[9],
        d10: arr[10],
        d11: arr[11],
        d12: arr[12],
        d13: arr[13],
        force: arr[14],
      };
      processedFile.spreadsheetData.push(row);
    });

    const roundedData = processedFile.spreadsheetData
      .filter((_, index) => index % 2 === 0)
      .map((obj) => {
        const newObj = {};
        for (const key in obj) {
          if (typeof obj[key] === 'number' && obj[key]) newObj[key] = obj[key].toFixed(2);
          else if (obj[key] === null) newObj[key] = '';
          else newObj[key] = obj[key].toString();
        }
        return newObj;
      });

    // Adiciona um id único para cada objeto em tableData
    const tableDataWithIds = roundedData.map((row, index) => ({ id: index, ...row }));
    setTableData(tableDataWithIds);
    setHeader(tempHeader);
    return tableDataWithIds;
  };

  const handleFileChange = async (file: File) => {
    if (nextDisabled && (file.name.includes('.xlsx') || file.name.includes('.csv'))) {
      const processedData = await processFile(file, processFwdFile);
      setData({ step: 2, key: 'spreadsheetData', value: processedData });
      setNextDisabled(false);
    }
  };

  const handleDownload = () => {
    try {
      const a = document.createElement('a');
      a.href = '/fwd-docs/fwd-formatado.xlsx';
      a.download = 'fwd-pavitech.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <FileInput onFileChange={handleFileChange} />
      <Button
        variant="contained"
        onClick={handleDownload}
        sx={{
          width: '15rem',
          color: 'white',
          fontWeight: '600',
        }}
      >
        Baixar Planilha Modelo
      </Button>
      {tableData.length > 0 && (
        <React.Fragment>
          <PreviewFwdTable rows={tableData} />
          <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem' }}>
            *Valores arredondados para melhor visualização
          </p>
        </React.Fragment>
      )}
    </Box>
  );
};

export default Fwd_Step3;
