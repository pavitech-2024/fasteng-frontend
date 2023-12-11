import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ABCP_EssaySelection = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [essays, setEssays] = useState<any>();
  const { materialSelectionData, essaySelectionData, setData } = useABCPStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const essays = await abcp.getEssaysByMaterialId(user._id, materialSelectionData);
          console.log("ensaios", essays);
          setEssays(essays);
          const { cement, fineAggregate_granulometrys, coarseAggregate_granulometrys, coarseAggregate_unit_masses } =
            essays;
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

  const fineAggregate_Inputs = [];

  if (essays) fineAggregate_Inputs.push(essays.fineAggregate)

  nextDisabled && setNextDisabled(false);

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
              const { _id, name, specific_mass, granulometrys, unitMass } = material;
              return (
                <Box>
                  <Typography>
                    {`${name} - Agregado miúdo`}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '1rem',

                    }}
                  >
                    <TextField
                      variant="standard"
                      key={`specific_mass_${_id}`}
                      label={t('specific-mass')}
                      value={specific_mass}
                      onChange={() => {
                        setData({ step: 2, key: "fineAggregates.specific_mass", value: specific_mass });
                      }}
                    />
                    {/* <DropDown
                      variant="standard"
                      key={`granulometry_${_id}`}
                      label={t('granulometry')}
                      options={granulometrys?.map((essay) => {
                        const { _id, name } = essay
                        return { label: name, value: { _id, name } };
                      })}
                      callback={(value) => {
                        setData({ step: 2, key: 'fineAggregates', value });
                      }}
                    /> */}
                    {/* <DropDown
                      variant="standard"
                      key={`granulometry_${_id}`}
                      label={t('unitMass')}
                      options={unitMass?.map((essay) => {
                        const { _id, name } = essay
                        return { label: name, value: { _id, name } };
                      })}
                      callback={(value) => {
                        setData({ step: 2, key: 'fineAggregates', value });
                      }}
                    /> */}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ABCP_EssaySelection;
