import { Box, Button } from '@mui/material';
import { EssayPageProps } from '@/components/templates/essay';
import useIggStore from '@/stores/asphalt/igg/igg.store';
import FileInput from '@/components/atoms/inputs/input-file';
import { processFile } from '@/utils/file';

const Igg_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { setData } = useIggStore();

  const handleFileChange = async (file: File) => {
    if (nextDisabled && (file.name.includes('.xlsx') || file.name.includes('.csv'))) {
      const processedData = await processFile(file);
      setData({ step: 2, key: 'stakes', value: processedData });
      setNextDisabled(false);
    }
  };

  const handleDownload = () => {
    try {
      const a = document.createElement('a');
      a.href = '/igg-docs/igg-pavitech.xlsx';
      a.download = 'igg-pavitech.xlsx';
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
    </Box>
  );
};

export default Igg_Step3;
