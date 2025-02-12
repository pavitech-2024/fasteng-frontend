import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCP_EssaySelectionData, ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ABCP_EssaySelection = ({ setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [essays, setEssays] = useState<any>();
  const { materialSelectionData, setData, essaySelectionData, generalData } = useABCPStore();

  const fineAggNominalDiameter = essays?.fineAggregateData.granulometrys.find(
    (element) => element._id === essaySelectionData.fineAggregate.granulometry_id
  )?.results?.nominal_diameter;

  const coarseAggNominalDiameter = essays?.coarseAggregateData.granulometrys.find(
    (element) => element._id === essaySelectionData.coarseAggregate.granulometry_id
  )?.results?.nominal_diameter;

  const coarseAggMaximumDiameter = essays?.coarseAggregateData.unit_masses.find(
    (element) => element._id === essaySelectionData.coarseAggregate.unitMass_id
  )?.results?.result;

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const essays = await abcp.getEssaysByMaterialId(materialSelectionData);
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

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const dosageData = sessionStorage.getItem('abcp-store');
          const sessionDataJson = JSON.parse(dosageData);
          const dosageDataJson = sessionDataJson.state as any;

          const response = await abcp.getStep3Data(dosageDataJson, dosageDataJson._id.toString());

          const prevData = { ...dosageDataJson };
          const newData = { ...prevData.generalData, step: 2 };
          prevData.generalData = newData;

          setData({
            step: 5,
            value: {
              ...prevData,
            },
          });
          setLoading(false);
        } catch (error) {
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('testeeeeeeee'),
      }
    );
  }, [essays]);

  const fineAggregate_Inputs = [];
  const coarseAggregate_Inputs = [];
  const binder_Inputs = [];

  if (essays) fineAggregate_Inputs.push(essays.fineAggregate);
  if (essays) coarseAggregate_Inputs.push(essays.coarseAggregate);
  if (essays) binder_Inputs.push(essays.cement);

  function hasNullValue(obj: ABCP_EssaySelectionData): boolean {
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
                <Typography>{`${essays?.fineAggregateData.name} - ${t('abcp.step-3.fine-aggregate')}`}</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <TextField
                    variant="standard"
                    key={`specificMass_${essays?.fineAggregateData._id}`}
                    label={t('abcp.step-3.fine-specific-mass')}
                    value={essaySelectionData?.fineAggregate?.specificMass}
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
                    key={`granulometry_${essays?.fineAggregateData._id}`}
                    label={t('abcp.step-3.granulometry')}
                    value={{
                      label: `${generalData.name} - (Diâmetro máximo: ${fineAggNominalDiameter}mm)`,
                      value: essaySelectionData.fineAggregate.granulometry_id,
                    }}
                    options={essays?.fineAggregateData.granulometrys?.map((essay) => {
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
                <Typography>{`${essays?.coarseAggregateData.name} - ${t('abcp.step-3.coarse-aggregate')}`}</Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <TextField
                    variant="standard"
                    key={`specific_mass_${essays?.coarseAggregateData._id}`}
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
                    key={`granulometry_${essays?.coarseAggregateData._id}`}
                    label={t('abcp.step-3.granulometry')}
                    value={{
                      label: `${generalData.name} - (Diâmetro máximo: ${coarseAggNominalDiameter}mm)`,
                      value: essaySelectionData.coarseAggregate.granulometry_id,
                    }}
                    options={essays?.coarseAggregateData.granulometrys?.map((essay) => {
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
                    key={`unit_mass_${essays?.coarseAggregateData._id}`}
                    label={t('abcp.step-3.unit_mass')}
                    value={{
                      label: `${generalData.name} - (Diâmetro máximo: ${coarseAggMaximumDiameter}mm)`,
                      value: essaySelectionData.coarseAggregate.unitMass_id,
                    }}
                    options={essays?.coarseAggregateData.unit_masses?.map((essay) => {
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
                  <Typography>{`${essays?.cementData.name} - ${t('abcp.step-3.cement')}`}</Typography>
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
                          _id: essays?.cementData._id,
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
