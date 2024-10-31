import ImgFileInput from '@/components/atoms/inputs/imgFileInput';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRtStore from '@/stores/concrete/concreteRt/concreteRt.store';
import { Margin } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addAbortSignal } from 'stream';

const ConcreteRt_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step3Data: data, setData } = useConcreteRtStore();

  const [selectedRupture, setSelectedRupture] = useState('');

  const inputs = [
    {
      key: 'appliedCharge',
      label: t('concrete.essays.applied-charge'),
      placeHolder: t('concrete.essays.applied-charge-placeholder'),
      adornment: 'N',
      type: 'number',
      value: data.appliedCharge,
    },
    {
      key: 'supportsDistance',
      label: t('concrete.essays.supports-distance'),
      placeHolder: t('concrete.essays.supports-distance-placeholder'),
      adornment: 'mm',
      type: 'number',
      value: data.supportsDistance,
    },
  ];

  const handleGraphImgUpload = (file: any) => {
    if (file) {
      setData({ step: 2, key: 'graphImg', value: { name: file.name, src: file.src } });
    }
  };

  if (
    nextDisabled &&
    data.appliedCharge &&
    data.supportsDistance &&
    data.graphImg
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
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'space-evenly', marginBottom: '2rem' }}>
        {inputs.map((input) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} key={input.key}>
            <Typography variant="h5">{input.label}</Typography>
            <InputEndAdornment
              adornment={input.adornment}
              placeholder={input.placeHolder}
              value={input.value}
              type={input.type}
              onChange={(e: any) => {
                setData({ step: 2, key: input.key, value: Number(e.target.value) });
              }}
            />
          </Box>
        ))}
      </Box>

      <Typography sx={{ textAlign: 'center' }} variant="h5">{t('concrete.essays.compressionRupture')}</Typography>

      <Typography sx={{ textAlign: 'center', marginTop: '2rem' }} variant="h5">{t('concrete.essays.graphImg')}</Typography>

      <Box sx={{ paddingY: '2rem' }}>
        <ImgFileInput onFileChange={(file) => handleGraphImgUpload(file)} file={data.graphImg} />
      </Box>
    </Box>
  );
};

export default ConcreteRt_Step3;
