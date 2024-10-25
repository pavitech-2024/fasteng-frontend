import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useConcreteRcStore from '@/stores/concrete/concreteRc/concreteRc.store';
import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const ConcreteRc_Step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step3Data: data, setData } = useConcreteRcStore();

  const [selectedRupture, setSelectedRupture] = useState('');
  console.log("🚀 ~ selectedRupture:", selectedRupture)

  const ruptureImg = [
    {
      key: 'A - conic',
      label: 'Tipo A: cônica',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoA-conica.png',
    },
    {
      key: 'A - conic25mm',
      label: 'Tipo A: cônica afastada em 25mm do capeamento',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoA-conica-2mm.png',
    },
    {
      key: 'B - conicBipartid',
      label: 'Tipo B: cônica bipartida',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoB-conica-bipartida.png',
    },
    {
      key: 'B - conicMultipleBipartid',
      label: 'Tipo B: cônica com mais de uma partição',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoB-conica-multiplas-biparticoes.png',
    },
    {
      key: 'C - conicColumn',
      label: 'Tipo C: coluna com formação de cones',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoC-coluna-cones.png',
    },
    {
      key: 'D - conicCis',
      label: 'Tipo D: conica e cisalhada',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoD-conica-cisalhada.png',
    },
    {
      key: 'E - cis',
      label: 'Tipo E: cisalhada',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoE-cisalhada.png',
    },
    {
      key: 'F - baseRuptures',
      label: 'Tipo F: fissuras na base do capeamento',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoF-fissuras-base.png',
    },
    {
      key: 'F - topRuptures',
      label: 'Tipo F: fissuras no topo do capeamento',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoF-fissuras-topo.png',
    },
    {
      key: 'G - multipleTopRuptures',
      label: 'Tipo G: multiplas fissuras no topo do capeamento',
      src: '/concrete/essays/rc/compressionRuptureImgs/tipoG-multiplas-fissuras-topo.png',
    },
  ];

  const handleSelectRupture = (img: any) => {
    if (img.key === selectedRupture) {
      setSelectedRupture('');
      setData({ step: 2, key: 'rupture', value: { type: null, src: null } })
    } else {
      setSelectedRupture(img.key);
      setData({ step: 2, value: { type: img.label, src: img.src } })
    }
  }

  if (
    nextDisabled &&
    !Object.values(data).some(e => e === null)
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
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '2rem', width: '100%', flexWrap: 'wrap' }}>
        {ruptureImg.map((img) => (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                justifyContent: 'space-between',
                placeItems: 'center',
                maxWidth: '14rem',
                minHeight: '15rem',
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
                  width: 200,
                  height: 200,
                  objectFit: 'cover',
                  border: selectedRupture === img.key ? '3px solid orange' : 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)', // Aumenta a escala para 5% maior no hover
                  },
                }}
                onClick={() => handleSelectRupture(img)}
              />
            </Box>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default ConcreteRc_Step3;
