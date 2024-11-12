import ImgFileInput from '@/components/atoms/inputs/imgFileInput';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';

const ConcreteRc_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step3Data: data, setData } = useConcreteRcStore();

  const [selectedRupture, setSelectedRupture] = useState('');

  const ruptureImg = [
    {
      key: 'A - conic',
      label: t('concrete.essays.conic'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoA-conica.png',
    },
    {
      key: 'A - conic25mm',
      label: t('concrete.essays.conic-25mm'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoA-conica-2mm.png',
    },
    {
      key: 'B - conicBipartid',
      label: t('concrete.essays.conic-bipartid'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoB-conica-bipartida.png',
    },
    {
      key: 'B - conicMultipleBipartid',
      label: t('concrete.essays.conic-multiple-bipartid'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoB-conica-multiplas-biparticoes.png',
    },
    {
      key: 'C - conicColumn',
      label: t('concrete.essays.conic-column'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoC-coluna-cones.png',
    },
    {
      key: 'D - conicCis',
      label: t('concrete.essays.conic-cis'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoD-conica-cisalhada.png',
    },
    {
      key: 'E - cis',
      label: t('concrete.essays.cis'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoE-cisalhada.png',
    },
    {
      key: 'F - baseRuptures',
      label: t('concrete.essays.baseRuptures'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoF-fissuras-base.png',
    },
    {
      key: 'F - topRuptures',
      label: t('concrete.essays.topRuptures'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoF-fissuras-topo.png',
    },
    {
      key: 'G - multipleTopRuptures',
      label: t('concrete.essays.multipleTopRuptures'),
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoG-multiplas-fissuras-topo.png',
    },
  ];

  const handleSelectRupture = (image: any) => {
    const updatedRupture = { ...data.rupture };
    if (image.key === selectedRupture) {
      setSelectedRupture('');
      updatedRupture.type = null;
      updatedRupture.src = null;
    } else {
      setSelectedRupture(image.key);
      updatedRupture.type = image.label;
      updatedRupture.src = image.src;
    }
    setData({ step: 2, value: { ...data, rupture: updatedRupture } });
  };

  const handleGraphImgUpload = (file: any) => {
    if (file) {
      setData({ step: 2, key: 'graphImg', value: { name: file.name, src: file.src } });
    }
  };

  if (
    nextDisabled &&
    !Object.values(data.rupture).some((e) => e === null) &&
    !Object.values(data.graphImg).some((e) => e === null)
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
      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        {t('concrete.essays.compression-rupture')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2rem',
          width: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {ruptureImg.map((img) => (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { mobile: 'none', notebook: '1rem' },
                justifyContent: 'space-between',
                placeItems: 'center',
                maxWidth: '14rem',
                minHeight: { mobile: '8rem', notebook: '15rem' },
                marginTop: '2rem',
              }}
            >
              <Typography>{img.label}</Typography>
              <Box
                key={img.key}
                component="img"
                src={img.src}
                alt={img.label}
                sx={{
                  width: { mobile: '8rem', notebook: '10rem' },
                  height: { mobile: '8rem', notebook: '10rem' },
                  objectFit: 'cover',
                  border: selectedRupture === img.key ? '3px solid orange' : 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => handleSelectRupture(img)}
              />
            </Box>
          </>
        ))}
      </Box>

      <Typography variant="h4" sx={{ textAlign: 'center', marginTop: '2rem' }}>
        {t('concrete.essays.graph-image')}
      </Typography>

      <Box sx={{ paddingY: '2rem' }}>
        <ImgFileInput onFileChange={(file) => handleGraphImgUpload(file)} file={data.graphImg} />
      </Box>
    </Box>
  );
};

export default ConcreteRc_Step3;
