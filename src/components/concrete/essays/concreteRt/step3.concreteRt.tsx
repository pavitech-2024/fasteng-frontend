import ImgFileInput from '@/components/atoms/inputs/imgFileInput';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

const ConcreteRt_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step3Data: data, setData } = useConcreteRtStore();

  // const inputs = [
  //   {
  //     key: 'appliedCharge',
  //     label: t('concrete.essays.applied-charge'),
  //     placeHolder: t('concrete.essays.applied-charge-placeholder'),
  //     adornment: 'N',
  //     type: 'number',
  //     value: data.appliedCharge,
  //   },
  //   {
  //     key: 'supportsDistance',
  //     label: t('concrete.essays.supports-distance'),
  //     placeHolder: t('concrete.essays.supports-distance-placeholder'),
  //     adornment: 'mm',
  //     type: 'number',
  //     value: data.supportsDistance,
  //   },
  // ];

  const handleGraphImgUpload = (file: any) => {
    if (file) {
      setData({ step: 2, key: 'graphImg', value: { name: file.name, src: file.src } });
    }
  };

  if (
    nextDisabled &&
    !Object.values(data.graphImg).some((key) => key === null)
  )
    setNextDisabled(false);

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

export default ConcreteRt_Step3;
