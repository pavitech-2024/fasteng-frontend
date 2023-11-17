import { EssayPageProps } from '../../../templates/essay';
import { t } from 'i18next';
import { Box, TextField } from '@mui/material';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcrete_step3 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useBinderAsphaltConcreteStore();

  const inputsPavimentData = [
    { label: t('pm.binderAsphaltConcrete.refinery'), value: step3Data.refinery, key: 'refinery', required: true },
    { label: t('pm.binderAsphaltConcrete.company'), value: step3Data.company, key: 'company', required: true },
    {
      label: t('pm.binderAsphaltConcrete.collectionDate'),
      value: step3Data.collectionDate,
      key: 'collectionDate',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.invoiceNumber'),
      value: step3Data.invoiceNumber,
      key: 'invoiceNumber',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.dataInvoice'),
      value: step3Data.dataInvoice,
      key: 'dataInvoice',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.certificateDate'),
      value: step3Data.certificateDate,
      key: 'certificateDate',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.capType'),
      value: step3Data.capType,
      key: 'capType',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.performanceGrade'),
      value: step3Data.performanceGrade,
      key: 'performanceGrade',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.penetration'),
      value: step3Data.penetration,
      key: 'penetration',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.softeningPoint'),
      value: step3Data.softeningPoint,
      key: 'softeningPoint',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.elasticRecovery'),
      value: step3Data.elasticRecovery,
      key: 'elasticRecovery',
      required: true,
    },
  ];

  const inputsBrookfieldViscosity = [
    { label: t('pm.binderAsphaltConcrete.vb_sp21_20'), value: step3Data.vb_sp21_20, key: 'vb_sp21_20', required: true },
    { label: t('pm.binderAsphaltConcrete.vb_sp21_50'), value: step3Data.vb_sp21_50, key: 'vb_sp21_50', required: true },
    {
      label: t('pm.binderAsphaltConcrete.vb_sp21_100'),
      value: step3Data.vb_sp21_100,
      key: 'vb_sp21_100',
      required: true,
    },
    {
      label: t('pm.binderAsphaltConcrete.observations'),
      value: step3Data.observations,
      key: 'observations',
      required: false,
    },
  ];

  inputsPavimentData.every(({ required }) => {
    if (!required) return true;

   // if (value === null) return false;

    //if (typeof value === 'string' && value.trim() === '') return false;

    return true;
  }) &&
    inputsBrookfieldViscosity.every(({ required }) => {
      if (!required) return true;

      //if (value === null) return false;

      // if (typeof value === 'string' && value.trim() === '') return false;

      return true;
    }) &&
    nextDisabled &&
    setNextDisabled(true);

  return (
    <>
      <FlexColumnBorder title={t('pm.paviment.data')} open={true} theme={'#07B811'}>
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
              gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsPavimentData.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>

      <FlexColumnBorder title={t('pm.brookfield.viscosity')} open={true} theme={'#07B811'}>
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
              gap: '10px 20px',
              paddingBottom: '20px',
            }}
          >
            {inputsBrookfieldViscosity.map((input) => {
              return (
                <TextField
                  key={input.key}
                  variant="standard"
                  label={input.label}
                  value={input.value}
                  required={input.required}
                  onChange={(e) => setData({ step: 0, key: input.key, value: e.target.value })}
                />
              );
            })}
          </Box>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default BinderAsphaltConcrete_step3;
