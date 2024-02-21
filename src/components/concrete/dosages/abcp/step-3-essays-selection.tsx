import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ABCP_EssaySelection = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [essays, setEssays] = useState<any>();
  const { materialSelectionData, setData, essaySelectionData, storedData } = useABCPStore();

  const { user } = useAuth();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const essays = await abcp.getEssaysByMaterialId(user._id, materialSelectionData);
          console.log('ensaios', essays);
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

  const fineAggregate_Inputs = [];
  const coarseAggregate_Inputs = [];
  const binder_Inputs = [];

  if (essays) fineAggregate_Inputs.push(essays.fineAggregate);
  if (essays) coarseAggregate_Inputs.push(essays.coarseAggregate);
  if (essays) binder_Inputs.push(essays.cement);

  function hasNullValue(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null || obj[key] === undefined) {
          return true;
        }
        if (typeof obj[key] === 'object' && hasNullValue(obj[key])) {
          return true;
        }
      }
    }
    return false;
  }

  const hasNull = hasNullValue(essaySelectionData);

  // Se hasNull for false, setNextDisabled para false; caso contrário, setNextDisabled para true.
  setNextDisabled(hasNull);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
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
              <Box>
                <Typography>{`${essays.fineAggregateData.name} - ${t('abcp.step-3.fine-aggregate')}`}</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <TextField
                    variant="standard"
                    key={`specificMass_${essays.fineAggregateData._id}`}
                    label={t('abcp.step-3.fine-specific-mass')}
                    value={essaySelectionData.fineAggregate.specificMass}
                    onChange={(e) => {
                      const prevData = {
                        ...essaySelectionData.fineAggregate,
                        specificMass: Number(e.target.value),
                        _id: materialSelectionData.fineAggregate,
                      };
                      setData({ step: 2, key: `fineAggregate`, value: prevData });
                    }}
                  />
                  <DropDown
                    variant="standard"
                    key={`granulometry_${essays.fineAggregateData._id}`}
                    label={t('abcp.step-3.granulometry')}
                    options={essays.fineAggregateData.granulometrys?.map((essay: any) => {
                      const { generalData, results, _id } = essay;
                      return {
                        label: `${generalData.name} - (Diâmetro máximo: ${results.nominal_diameter}mm)`,
                        value: _id,
                      };
                    })}
                    callback={(value) => {
                      const prevData = { ...essaySelectionData.fineAggregate, granulometry_id: value };
                      setData({ step: 2, key: 'fineAggregate', value: prevData });
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
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
              <Box>
                <Typography>{`${essays.coarseAggregateData.name} - ${t('abcp.step-3.coarse-aggregate')}`}</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <TextField
                    variant="standard"
                    key={`specific_mass_${essays.coarseAggregateData._id}`}
                    label={t('abcp.step-3.coarse-specific-mass')}
                    value={essaySelectionData.coarseAggregate.specificMass}
                    onChange={(e) => {
                      const prevData = {
                        ...essaySelectionData.coarseAggregate,
                        specificMass: Number(e.target.value),
                        _id: materialSelectionData.coarseAggregate,
                      };
                      setData({ step: 2, key: 'coarseAggregate', value: prevData });
                    }}
                  />
                  <DropDown
                    variant="standard"
                    key={`granulometry_${essays.coarseAggregateData._id}`}
                    label={t('abcp.step-3.granulometry')}
                    options={essays.coarseAggregateData.granulometrys?.map((essay: any) => {
                      const { generalData, results, _id } = essay;
                      return {
                        label: `${generalData.name} - (Diâmetro máximo: ${results.nominal_diameter}mm)`,
                        value: _id,
                      };
                    })}
                    callback={(value) => {
                      const prevData = { ...essaySelectionData.coarseAggregate, granulometry_id: value };
                      setData({ step: 2, key: 'coarseAggregate', value: prevData });
                    }}
                  />
                  <DropDown
                    variant="standard"
                    key={`unit_mass_${essays.coarseAggregateData._id}`}
                    label={t('abcp.step-3.unit_mass')}
                    options={essays.coarseAggregateData.unit_masses?.map((essay: any) => {
                      const { generalData, result, _id } = essay;
                      return {
                        key: _id,
                        label: `${generalData.experimentName} - (Diâmetro máximo: ${result?.result}mm)`,
                        value: _id,
                      };
                    })}
                    callback={(value) => {
                      const prevData = { ...essaySelectionData.coarseAggregate, unitMass_id: value };
                      setData({ step: 2, key: 'coarseAggregate', value: prevData });
                    }}
                  />
                </Box>
              </Box>
            </Box>
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
                <Box>
                  <Typography>{`${essays.cementData.name} - ${t('abcp.step-3.cement')}`}</Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '1rem',
                    }}
                  >
                    <TextField
                      variant="standard"
                      key={`specific_mass_${essaySelectionData.cement._id}`}
                      label={t('abcp.step-3.cement-specific-mass')}
                      value={essaySelectionData.cement.specificMass}
                      onChange={(e) => {
                        const prevData = {
                          ...essaySelectionData.cement,
                          specificMass: Number(e.target.value),
                          _id: essays.cementData._id,
                        };
                        setData({ step: 2, key: 'cement', value: prevData });
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ABCP_EssaySelection;
