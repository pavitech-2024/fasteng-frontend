import ImgFileInput from '@/components/atoms/inputs/imgFileInput';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

const ConcreteRt_Step4 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step4Data: data, setData } = useConcreteRtStore();

  const inputs = [
    {
      key: 'compressionCharge',
      label: t('concrete.essays.compression-charge'),
      placeHolder: t('concrete.essays.compression-charge-placeholder'),
      adornment: 'N',
      type: 'number',
      value: data.compressionCharge,
    }
  ];

  const handleGraphImgUpload = (file: any) => {
    if (file) {
      setData({ step: 3, key: 'graphImg', value: { name: file.name, src: file.src } });
    }
  };

  if (nextDisabled && data.compressionCharge && !Object.values(data.graphImg).some((value) => value === null)) setNextDisabled(false);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { mobile: '1fr' },
        gap: '10px',
        mt: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '20rem',
          marginBottom: '2rem',
        }}
      >
        {inputs.map((input) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '30%', marginX: 'auto'  }} key={input.key}>
            <Typography variant="h5">{input.label}</Typography>
            <InputEndAdornment
              adornment={input.adornment}
              placeholder={input.placeHolder}
              value={input.value}
              type={input.type}
              onChange={(e: any) => {
                setData({ step: 3, key: input.key, value: Number(e.target.value) });
              }}
            />
          </Box>
        ))}
      </Box>

      <Typography sx={{ textAlign: 'center', marginTop: '2rem' }} variant="h5">
        {t('concrete.essays.graphImg')}
      </Typography>

      <Box sx={{ paddingY: '2rem' }}>
        <ImgFileInput onFileChange={(file) => handleGraphImgUpload(file)} file={data.graphImg} />
      </Box>
    </Box>
  );
};

export default ConcreteRt_Step4;
