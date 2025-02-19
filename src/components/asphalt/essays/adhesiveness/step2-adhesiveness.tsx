import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import ADHESIVENESS_SERVICE from '@/services/asphalt/essays/adhesiveness/adhesiveness.service';
import useAdhesivenessStore from '@/stores/asphalt/adhesiveness/adhesiveness.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/molecules/loading';
import DropDown from '@/components/atoms/inputs/dropDown';

const ADHESIVENESS_Step2 = ({
  setNextDisabled,
  adhesiveness,
}: EssayPageProps & { adhesiveness: ADHESIVENESS_SERVICE }) => {
  const { adhesiveness: data, setData } = useAdhesivenessStore();
  const [binders, setBinders] = useState<AsphaltMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        const binders = await adhesiveness.getBindersByUserId(user._id);

        setBinders(binders);
        setLoading(false);
      },
      {
        pending: t('loading.binders.pending'),
        success: t('adhesiveness.material.loading.binders.success'),
        error: t('loading.binders.error'),
      }
    );
    // se não deixar o array vazio ele vai ficar fazendo requisições infinitas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [inputs, setInputs] = useState([
    {
      label: t('adhesiveness.binders'),
      key: 'binder',
      value: null as null | string,
      required: true,
    },
    {
      label: t('adhesiveness.filmDisplacement'),
      key: 'filmDisplacement',
      value: null as boolean | null,
      required: true,
    },
  ]);

  useEffect(() => {
    const allRequiredFilled = inputs.every(({ required, value }) => {
      if (required) {
        return value !== null;
      }
      return true;
    });
    setNextDisabled(!allRequiredFilled);
  }, [inputs, setNextDisabled]);

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
            gap: '20px',
          }}
        >
          {inputs.map((input, index) => (
            <Box
              key={input.key}
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <DropDown
                variant="standard"
                sx={{
                  width: '300px',
                }}
                label={input.label}
                options={
                  input.key === 'binder'
                    ? binders.map((binder) => {
                        return {
                          label: binder.name + ' | ' + t(`${'asphalt.binders.' + binder.type}`),
                          value: binder,
                        };
                      })
                    : input.key === 'filmDisplacement'
                    ? [
                        {
                          label: t('adhesiveness.filmDisplacement-true'),
                          value: true,
                        },
                        {
                          label: t('adhesiveness.filmDisplacement-false'),
                          value: false,
                        },
                      ]
                    : []
                }
                value={
                  input.key === 'binder'
                    ? { label: data[input.key]?.name || '', value: data[input.key] || '' }
                    : input.key === 'filmDisplacement'
                    ? data[input.key] === false
                      ? { label: t('adhesiveness.filmDisplacement-false'), value: false }
                      : data[input.key] === true
                      ? { label: t('adhesiveness.filmDisplacement-true'), value: true }
                      : null
                    : null
                }                
                required={input.required}
                size="medium"
                callback={(value: string | boolean) => {
                  setData({ step: 1, key: input.key, value: input.key === 'binder' ? value : value });
                  const updatedInputs = [...inputs];
                  updatedInputs[index].value = value;
                  setInputs(updatedInputs);
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default ADHESIVENESS_Step2;
