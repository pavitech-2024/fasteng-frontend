import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterialData } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Superpave_Step4 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, initialBinderData: data, setData } = useSuperpaveStore();

  const [specificMassModalIsOpen, setSpecificMassModalIsOpen] = useState(true);
  const materials = materialSelectionData.aggregates.map((item) => item.name);

  const { user } = useAuth();

  const [binderData, setBinderData] = useState<AsphaltMaterialData>();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const response = await materialsService.getMaterial(materialSelectionData.binder);
          
          setBinderData(response.data.material);

          // setLoading(false);
        } catch (error) {
          // setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  const modalMaterial_1Inputs = [
    {
      key: 'realSpecificMass',
      placeHolder: 'Massa específica real',
      adornment: 'g/cm²',
      value: data.material_1.realSpecificMass,
    },
    {
      key: 'apparentSpecificMass',
      placeHolder: 'Massa específica aparente',
      adornment: 'g/cm²',
      value: data.material_1.apparentSpecificMass,
    },
    {
      key: 'absorption',
      placeHolder: 'Absorção',
      adornment: '%',
      value: data.material_1.absorption,
    },
  ];

  const modalMaterial_2Inputs = [
    {
      key: 'realSpecificMass',
      placeHolder: 'Massa específica real',
      adornment: 'g/cm²',
      value: data.material_2.realSpecificMass,
    },
    {
      key: 'apparentSpecificMass',
      placeHolder: 'Massa específica aparente',
      adornment: 'g/cm²',
      value: data.material_2.apparentSpecificMass,
    },
    {
      key: 'absorption',
      placeHolder: 'Absorção',
      adornment: '%',
      value: data.material_2.absorption,
    },
  ];

  const handleModalSubmit = () => {
    toast.promise(
      async () => {
        try {
          await superpave.getStep4Data(materialSelectionData, data)
          
          setSpecificMassModalIsOpen(false)
        } catch (error) {
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'granulometricComposition',
      headerName: 'Composição Granulométrica',
      valueFormatter: ({value}) => `${value}`
    },
    {
      field: 'combinedGsb',
      headerName: 'Gsb combinado (g/cm³)',
      valueFormatter: ({value}) => `${value}`
    },
    {
      field: 'combinedGsa',
      headerName: 'Gsa combinado (g/cm³)',
      valueFormatter: ({value}) => `${value}`
    },
    {
      field: 'gse',
      headerName: 'Gse (g/cm³)',
      valueFormatter: ({value}) => `${value}`
    },
  ];

  const rows = []

  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
          }}
        >
          <DataGrid columns={columns} rows={rows} />
        </Box>
      )}

      {specificMassModalIsOpen && (
        <ModalBase
          title={'Insira as massas específicas dos materiais'}
          leftButtonTitle={''}
          rightButtonTitle={''}
          onCancel={() => {
            setSpecificMassModalIsOpen(false);
            setLoading(false);
          }}
          open={specificMassModalIsOpen}
          size={'large'}
          onSubmit={handleModalSubmit}
          oneButton={true}
          singleButtonTitle="Confirmar"
        >
          <Typography>{materials[0]}</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'row', marginBottom: '2rem' }}>
              {modalMaterial_1Inputs.map((input) => (
                <InputEndAdornment
                  key={input.key}
                  adornment={input.adornment}
                  value={input.value}
                  placeholder={input.placeHolder}
                  fullWidth
                  onChange={(e) => {
                    setData({ step: 3, key: `material_1`, value: {...data.material_1, [input.key]: Number(e.target.value)}})
                  }}
                />
              ))}
            </Box>
          </Box>

          <Typography>{materials[1]}</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'row', marginBottom: '2rem' }}>
              {modalMaterial_2Inputs.map((input) => (
                <InputEndAdornment
                  key={input.key}
                  adornment={input.adornment}
                  value={input.value}
                  placeholder={input.placeHolder}
                  fullWidth
                  onChange={(e) => {
                    setData({ step: 3, key: `material_2`, value: {...data.material_2, [input.key]: Number(e.target.value)}})
                  }}
                />
              ))}
            </Box>
          </Box>

          <Typography>{binderData?.name}</Typography>

          <Box>
            <InputEndAdornment
              adornment={'g/cm²'}
              placeholder="Massa especifica real"
              value={data.binderSpecificMass}
              onChange={(e) => {
                setData({ step: 3, key: 'binderSpecificMass', value: Number(e.target.value) });
              }}
            />
          </Box>
        </ModalBase>
      )}
    </>
  );
};

export default Superpave_Step4;
