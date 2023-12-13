import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { ConcreteGranulometryData } from '@/stores/concrete/granulometry/granulometry.store';
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
          const { cement, fineAggregate, coarseAggregate } =
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
  const coarseAggregate_Inputs = [];

  if (essays) fineAggregate_Inputs.push(essays.fineAggregate)
  if (essays) coarseAggregate_Inputs.push(essays.coarseAggregate)
  console.log("🚀 ~ file: step-3-essays-selection.tsx:50 ~ coarseAggregate_Inputs:", coarseAggregate_Inputs)

  nextDisabled && setNextDisabled(false);

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
              {fineAggregate_Inputs.map((material) => {
                const { _id, name, specific_mass, granulometrys } = material;
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
                        } } />
                      <DropDown
                        variant="standard"
                        key={`granulometry_${_id}`}
                        label={t('granulometry')}
                        options={granulometrys?.map((essay: any) => {
                          const { generalData, results, _id } = essay;
                          return {
                            label: `${generalData.name} - (Diâmetro máximo: ${results.nominal_diameter}mm)`,
                            value: {
                              _id,
                              name: generalData.name
                            }
                          };
                        })}
                        callback={(value) => {
                          setData({ step: 2, key: 'fineAggregates', value });
                        } } />
                    </Box>
                  </Box>
                );
              })}
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
              {coarseAggregate_Inputs.map((material) => {
                const { _id, name, specific_mass, granulometrys, unit_masses } = material;
                return (
                  <Box>
                    <Typography>
                      {`${name} - Agregado graúdo`}
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
                          setData({ step: 2, key: "coarseAggregates.specific_mass", value: specific_mass });
                        } } 
                      />
                      <DropDown
                        variant="standard"
                        key={`granulometry_${_id}`}
                        label={t('granulometry')}
                        options={granulometrys?.map((essay: any) => {
                          const { generalData, results, _id } = essay;
                          return {
                            label: `${generalData.name} - (Diâmetro máximo: ${results.nominal_diameter}mm)`,
                            value: {
                              _id,
                              name: generalData.name
                            }
                          };
                        })}
                        callback={(value) => {
                          setData({ step: 2, key: 'coarseAggregates', value });
                        } } 
                      />
                      <DropDown
                        variant="standard"
                        key={`unit_mass_${_id}`}
                        label={t('unit_mass')}
                        options={unit_masses?.map((essay: any) => {
                          const { generalData, results, _id } = essay;
                          return {
                            label: `${generalData.name} - (Diâmetro máximo: ${results?.result}mm)`,
                            value: {
                              _id,
                              name: generalData.name
                            }
                          };
                        })}
                        callback={(value) => {
                          setData({ step: 2, key: 'unit_masses', value });
                        } } 
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ABCP_EssaySelection;
