import { Box, Button } from '@mui/material';
import { EssayPageProps } from '@/components/templates/essay';
import useIggStore from '@/stores/asphalt/igg/igg.store';
import FileInput from '@/components/atoms/inputs/input-file';
import { processFile } from '@/components/util/file';

const Igg_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { setData } = useIggStore();

  const processIggFile = (file: any) => {
    const processedFile = [];
    const header = [
      'km',
      'secao',
      'fi',
      'ttc',
      'ttl',
      'tlc',
      'tll',
      'trr',
      'j',
      'tb',
      'je',
      'tbe',
      'alp',
      'atp',
      'alc',
      'atc',
      'o',
      'p',
      'e',
      'ex',
      'd',
      'r',
      'tri',
      'ter',
    ];
    processedFile.push(header);
  
    const fileWithoutUselessRows = file.slice(4, file.length);
  
    fileWithoutUselessRows.forEach((item) => {
      const arr = new Array(24).fill(null);
      arr[0] = item['INVENTÁRIO DO ESTADO DA SUPERFÍCIE DO PAVIMENTO'];
      arr[1] = item['__EMPTY'];
  
      let keys = Object.keys(item);
      keys = keys.slice(2, keys.length);
      keys.forEach((key) => {
        const column = parseInt(key.substring('__EMPTY_'.length));
        if (column < 21) {
          arr[column + 1] = true;
        } else {
          arr[column + 1] = item[key];
        }
      });
  
      processedFile.push(arr);
    });
    return processedFile;
  };
  

  const handleFileChange = async (file: File) => {
    if (nextDisabled && (file.name.includes('.xlsx') || file.name.includes('.csv'))) {

      //Passa como parâmetro para o processFile o arquivo lido e o método de processamento específico do ensaio
      const processedData = await processFile(file, processIggFile);
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
