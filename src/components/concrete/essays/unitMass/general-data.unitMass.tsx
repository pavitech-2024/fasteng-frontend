/* eslint-disable @typescript-eslint/no-unused-vars */
import { EssayPageProps } from '@/components/templates/essay';
import UNITMASS_SERVICE from '@/services/concrete/essays/unitMass/unitMass.service';
import useUnitMassStore from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import DropDown from '@/components/atoms/inputs/dropDown';
import React, { useEffect, useState } from 'react';
import { ConcreteMaterial } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { toast } from 'react-toastify';
import useAuth from '@/contexts/auth';
import Loading from '@/components/molecules/loading';

const UnitMass_GeneralData = ({
  nextDisabled,
  setNextDisabled,
  unitMass,
}: EssayPageProps & { unitMass: UNITMASS_SERVICE }) => {
  const { generalData, setData } = useUnitMassStore();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const [materialDropdownDefaultValue, setMaterialDropdownDefaultValue] = useState<string>('');

  useEffect(() => {
    toast.promise(
      async () => {
        const data = await unitMass.getmaterialsByUserId(user._id);
        console.log('🚀 ~ data:', data);

        setMaterials(data[0].materials);
        setLoading(false);
      },
      {
        pending: t('loading.samples.pending'),
        success: t('loading.samples.success'),
        error: t('loading.samples.error'),
      }
    );
  }, [user]);

  useEffect(() => {
    if (generalData.material?.name !== null) {
      setMaterialDropdownDefaultValue(generalData.material?.name);
    }
  }, [generalData.material]);

  const methodOptions = [
    {
      label: t('unitMass.method.A'),
      value: 'A',
      key: 'method',
    },
    {
      label: t('unitMass.method.B'),
      value: 'B',
      key: 'method',
    },
    {
      label: t('unitMass.method.C'),
      value: 'C',
      key: 'method',
    },
  ];

  useEffect(() => {
    if (generalData.experimentName !== null && generalData.method !== null && generalData.material !== null)
      nextDisabled && setNextDisabled(false);
  }, [generalData, nextDisabled, setNextDisabled]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
            {/** Nome do experimento */}
            <TextField
              variant="standard"
              key="experimentName"
              label={t('unitMass.experimentName')}
              value={generalData.experimentName}
              required
              onChange={(e) => setData({ step: 0, key: 'experimentName', value: e.target.value })}
              size="medium"
            />
            {/** Material escolhido */}
            <DropDown
              key={'material'}
              variant="standard"
              label={t('unitMass.material')}
              options={materials?.map((material: ConcreteMaterial) => {
                return {
                  label: material.name + ' | ' + t(`${'concrete.materials.' + material.type}`),
                  value: material,
                };
              })}
              value={{
                label:
                  materials.find((material) => material.name === materialDropdownDefaultValue)?.name +
                  ' | ' +
                  t(
                    `${
                      'concrete.materials.' +
                      materials.find((material) => material.name === materialDropdownDefaultValue)?.type
                    }`
                  ),
                value: materials.find((material) => material.name === materialDropdownDefaultValue),
              }}
              callback={(value) => setData({ step: 0, key: 'material', value })}
              size="medium"
              required
            />
            {/** Método escolhido */}
            <DropDown
              key={'method'}
              variant="standard"
              label={t('unitMass.method')}
              options={methodOptions.map((method) => {
                return { label: method.label, value: method.value };
              })}
              value={methodOptions.find((option) => option.value === generalData.method)}
              callback={(value: string) => setData({ step: 0, key: 'method', value })}
              size="medium"
              required
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default UnitMass_GeneralData;
