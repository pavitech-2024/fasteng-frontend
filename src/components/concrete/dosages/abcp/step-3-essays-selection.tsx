import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ABCP_EssaySelection = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [essays, setEssays] = useState<ABCPData['essaySelectionData']>();
  const { materialSelectionData, essaySelectionData, setData } = useABCPStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const essays = await abcp.getEssaysByMaterialId(user._id, materialSelectionData);
          console.log(essays);
          setEssays(essays);
          setLoading(false);
        } catch (error) {
          setEssays(null);
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.essays.pending'),
        success: t('loading.essays.success'),
        error: t('loading.essays.error'),
      }
    );
  }, []);

  const fineAggregate_Inputs = essays.fineAggregates;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: '10px',
          }}
        >
          <Box
            sx={{
              p: '1rem',
              textAlign: 'center',
              border: '1px solid lightgray',
              borderRadius: '10px',
            }}
          >
            {fineAggregate_Inputs.map((material) => {
              const { _id, name } = material;
              return (
                <Box
                  key={_id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <TextField variant="standard" key={_id} label={t('specifc-mass')} />
                  <DropDown
                    key={`${name}-granulometry`}
                    variant="standard"
                    label={t('granulometry')}
                    options={['teste 1', 'teste 2'].map((granulometry) => {
                      return { label: granulometry, value: '' };
                    })}
                    callback={(value) => {
                      // setData({ step: 1, key: 'sieve_series', value });
                      // setData({ step: 1, key: 'table_data', value: [] });
                    }}
                    size="medium"
                    required
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ABCP_EssaySelection;
