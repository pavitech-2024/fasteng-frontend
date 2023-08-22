import { EssayPageProps } from '@/components/templates/essay';
import UNITMASS_SERVICE from '@/services/concrete/essays/unitMass/unitMass.service';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import React from 'react';

const UnitMass_GeneralData = ({}: // nextDisabled,
// setNextDisabled,
// unitMass,
EssayPageProps & { unitMass: UNITMASS_SERVICE }) => {
  const { generalData, setData } = useUnitMassStore();

  const methodOptions = [
    {
      label: t('unitMass.method'),
      value: 'A',
    },
    {
      label: t('unitMass.method'),
      value: 'B',
    },
    {
      label: t('unitMass.method'),
      value: 'C',
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' },
            gap: '5px 20px',
          }}
        >
          {/** Agregado sem diametro máximo (m) */}
          <TextField
            variant="standard"
            key="experimentName"
            label={t('unitMass.experimentName')}
            value={generalData.experimentName}
            required
            onChange={(e) => setData({ step: 0, key: 'experimentName', value: e.target.value })}
          />
          <DropDown
            key={'method'}
            variant="standard"
            label={t('unitMass.method')}
            options={methodOptions.map((method) => {
              return { label: method.label, value: method.value };
            })}
            defaultValue={methodOptions[0]}
            callback={(value: string) => setData({ step: 0, key: 'method', value })}
            size="medium"
            required
          />
        </Box>
      </Box>
    </>
  );
};

export default UnitMass_GeneralData;
