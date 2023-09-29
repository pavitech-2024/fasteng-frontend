import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import ADHESIVENESS_SERVICE from '@/services/asphalt/essays/adhesiveness/adhesiveness.service';
import useAdhesivenessStore from '@/stores/asphalt/adhesiveness.store';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/molecules/loading';
import DropDown from '@/components/atoms/inputs/dropDown';

const ADHESIVENESS_Step2 = ({
  nextDisabled,
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
        success: t('loading.binders.success'),
        error: t('loading.binders.error'),
      }
    );
    // se não deixar o array vazio ele vai ficar fazendo requisições infinitas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputs = [
    {
      label: t('adhesiveness.filmDisplacement'),
      adornment: 'L',
      key: 'displaced_volume',
      value: data.filmDisplacement,
      required: true,
    },
  ];

  // verificar se todos os required estão preenchidos, se sim setNextDisabled(false)
  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

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
            justifyContent: 'center',
          }}
        >
          {inputs.map((input) => (
            <DropDown
              key={input.key}
              variant="standard"
              label={input.label}
              options={binders.map((material) => {
                return { label: material.name + ' | ' + t(`${'binders.' + material.type}`), value: material };
              })}
              required={input.required}
              size="medium"
              callback={(value) => setData({ step: 0, key: input.key, value: value })}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default ADHESIVENESS_Step2;
