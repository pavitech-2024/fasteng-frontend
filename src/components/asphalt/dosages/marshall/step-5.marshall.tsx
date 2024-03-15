import DropDown, { DropDownOption } from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import Loading from '@/components/molecules/loading';
import ModalBase from '@/components/molecules/modals/modal';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import { Box } from '@mui/material';
import { ChangeEvent, useState } from 'react';

const Marshall_Step5 = ({
  nextDisabled,
  setNextDisabled,
  marshall,
}: EssayPageProps & { marshall: Marshall_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { materialSelectionData, maximumMixtureDensityData: data, setData } = useMarshallStore();

  const [DMTModalIsOpen, setDMTModalISOpen] = useState(false);
  const [GMMModalIsOpen, setGMMModalISOpen] = useState(false);

  const { user } = useAuth();

  const list = {
    '15°C - 0.9991': 0.9991,
    '16°C - 0.9989': 0.9989,
    '17°C - 0.9988': 0.9988,
    '18°C - 0.9986': 0.9986,
    '19°C - 0.9984': 0.9984,
    '20°C - 0.9982': 0.9982,
    '21°C - 0.9980': 0.998,
    '22°C - 0.9978': 0.9978,
    '23°C - 0.9975': 0.9975,
    '24°C - 0.9973': 0.9973,
    '25°C - 0.9970': 0.997,
    '26°C - 0.9968': 0.9968,
    '27°C - 0.9965': 0.9965,
    '28°C - 0.9962': 0.9962,
    '29°C - 0.9959': 0.9959,
    '30°C - 0.9956': 0.9956,
  };

  const array = [];

  const teste = Object.keys(list).forEach((key) => {
    array.push({
      label: key,
      value: list[key],
    });
  });

  const calcMethodOptions: DropDownOption[] = [
    { label: 'DMT - Densidade máxima teórica', value: '' },
    { label: 'GMM - Densidade máxima medida', value: '' },
  ];

  nextDisabled && setNextDisabled(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <DropDown
            key={'dropdown'}
            variant="standard"
            label={'Selecione o método de cálculo da densidade da mistura'}
            options={calcMethodOptions}
            callback={() => setDMTModalISOpen(true)}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />
          <DropDown
            key={'dropdown'}
            variant="standard"
            label={'Selecione o fator de correção para a temperatura da água'}
            options={array}
            callback={() => setGMMModalISOpen(true)}
            size="medium"
            sx={{ width: '75%', marginX: 'auto' }}
          />
          <ModalBase
            title={'Insira a massa específica real dos materiais abaixo'}
            children={
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <InputEndAdornment
                  adornment={'g/cm³'}
                  value={data?.dmt?.material_2}
                  onChange={(e) => setData({ step: 5, key: 'dmtMaterial_1', value: e.target.value })}
                />
                <InputEndAdornment
                  adornment={'g/cm³'}
                  value={data?.dmt?.material_1}
                  onChange={(e) => setData({ step: 5, key: 'dmtMaterial_2', value: e.target.value })}
                />
              </Box>
            }
            leftButtonTitle={'cancelar'}
            rightButtonTitle={'confirmar'}
            onCancel={() => setDMTModalISOpen(false)}
            open={DMTModalIsOpen}
            size={'large'}
            onSubmit={() => console.log('')}
          />
        </Box>
      )}
    </>
  );
};

export default Marshall_Step5;
