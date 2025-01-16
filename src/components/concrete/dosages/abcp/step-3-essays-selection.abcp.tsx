import DropDown from '@/components/atoms/inputs/dropDown';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import { ConcreteMaterialData } from '@/interfaces/concrete';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore from '@/stores/concrete/abcp/abcp.store';
import { ConcreteGranulometryData } from '@/stores/concrete/granulometry/granulometry.store';
import { ConcreteUnitMassData } from '@/stores/concrete/unitMass/unitMass.store';
import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IConcreteGranulometryDataId extends ConcreteGranulometryData {
  _id: string;
}

interface IConcreteUnitMassDataId extends ConcreteUnitMassData {
  _id: string;
}

type AggregatesData = {
  granulometrys: IConcreteGranulometryDataId[];
  unitMasses: IConcreteUnitMassDataId[];
};

interface IConcreteMaterialDataId extends ConcreteMaterialData {
  _id: string;
}

type EssaysData = {
  aggregatesData: AggregatesData[];
  cementData: IConcreteMaterialDataId;
};

const ABCP_EssaySelection = ({ setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [essays, setEssays] = useState<EssaysData>();
  console.log('🚀 ~ constABCP_EssaySelection= ~ essays:', essays);
  const { materialSelectionData, setData, essaySelectionData } = useABCPStore();

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const essays = await abcp.getEssaysByMaterialId(materialSelectionData);
          setEssays(essays);

          const aggregateEssays: AggregatesData[] = essays?.aggregatesData.flatMap((aggregates) => {
            if (aggregates.granulometrys.length > 0) {
              return aggregates.granulometrys.map((granulometry, i) => ({
                granulometryId: granulometry._id,
                unitMassId: aggregates.unitMasses[i]?._id ?? null,
                granulometryName: granulometry.generalData.name,
                unitMassName: aggregates.unitMasses[i]?.generalData.experimentName ?? null,
                materialName: granulometry.generalData.material.name,
                materialId: granulometry.generalData.material._id,
                type: granulometry.generalData.material.type,
                nominalDiameter: granulometry.results.nominal_diameter,
                maximumDiameter: aggregates.unitMasses[i]?.result?.result ?? null,
                specificMass: null,
              }));
            } else if (aggregates.unitMasses.length > 0) {
              return [
                {
                  granulometryId: null,
                  unitMassId: aggregates.unitMasses[0]?._id,
                  granulometryName: null,
                  unitMassName: aggregates.unitMasses[0]?.generalData.experimentName,
                  materialName: aggregates.unitMasses[0].generalData.material.name,
                  materialId: aggregates.unitMasses[0].generalData.material._id,
                  type: aggregates.unitMasses[0].generalData.material.type,
                  nominalDiameter: null,
                  maximumDiameter: aggregates.unitMasses[0]?.result?.result ?? null,
                  specificMass: null,
                },
              ];
            }
            return [];
          });

          setData({ step: 2, key: 'aggregateEssays', value: aggregateEssays });

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

  const hasNullValues = essaySelectionData.selectedEssays.some((material) => {
    const isCoarseAggregate = material.materialType === 'coarseAggregate';
    let coarseAggHasNullValues: boolean;
    let fineAggHasNullValues: boolean;

    if (!isCoarseAggregate) {
      fineAggHasNullValues = !material.granulometryId || !material.specificMassValue;
    } else {
      coarseAggHasNullValues = Object.values(material).some((value) => value === null);
    }

    return coarseAggHasNullValues && fineAggHasNullValues;
  });

  if (!hasNullValues) setNextDisabled(false);

  const findSelectedEssayId = (materialId) => {
    return essaySelectionData.selectedEssays.findIndex((e) => e.materialId === materialId);
  };

  const selectedUnitMassName = essays?.aggregatesData
    .find((material) => {
      return material.unitMasses.find((unitMass) => {
        if (
          unitMass._id ===
          essaySelectionData.selectedEssays[findSelectedEssayId(unitMass.generalData.material._id)]?.unitMassId
        ) {
          return unitMass.generalData.experimentName;
        }
      });
    })
    ?.unitMasses.find(
      (unitMass) =>
        unitMass._id ===
        essaySelectionData.selectedEssays[findSelectedEssayId(unitMass.generalData.material._id)]?.unitMassId
    )?.generalData.experimentName;

  const selectedUnitMassId = essays?.aggregatesData
    .find((material) => {
      return material.unitMasses.find((unitMass) => {
        if (
          unitMass._id ===
          essaySelectionData.selectedEssays[findSelectedEssayId(unitMass.generalData.material._id)]?.unitMassId
        ) {
          return unitMass.generalData.experimentName;
        }
      });
    })
    ?.unitMasses.find(
      (unitMass) =>
        unitMass._id ===
        essaySelectionData.selectedEssays[findSelectedEssayId(unitMass.generalData.material._id)]?.unitMassId
    )?._id;

  const unitMassDropdownDefault = {
    label: selectedUnitMassName,
    value: selectedUnitMassId,
  };

  //granulometry dropdown selected option
  const selectedGranulometryName = essays?.aggregatesData
    .find((material) => {
      return material.granulometrys.find((granulometry) => {
        if (
          granulometry._id ===
          essaySelectionData.selectedEssays[findSelectedEssayId(granulometry.generalData.material._id)]?.granulometryId
        ) {
          return granulometry.generalData.name;
        }
      });
    })
    ?.granulometrys.find(
      (granulometry) =>
        granulometry._id ===
        essaySelectionData.selectedEssays[findSelectedEssayId(granulometry.generalData.material._id)]?.granulometryId
    )?.generalData.name;

  const selectedGranulometryId = essays?.aggregatesData
    .find((material) => {
      return material.granulometrys.find((granulometry) => {
        if (
          granulometry._id ===
          essaySelectionData.selectedEssays[findSelectedEssayId(granulometry.generalData.material._id)]?.granulometryId
        ) {
          return granulometry.generalData.name;
        }
      });
    })
    ?.unitMasses.find(
      (granulometry) =>
        granulometry._id ===
        essaySelectionData.selectedEssays[findSelectedEssayId(granulometry.generalData.material._id)]?.granulometryId
    )?._id;

  const granulometryDropdownDefault = {
    label: selectedGranulometryName,
    value: selectedGranulometryId,
  };
  console.log('🚀 ~ constABCP_EssaySelection= ~ granulometryDropdownDefault:', granulometryDropdownDefault);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4rem',
            }}
          >
            {essaySelectionData?.aggregateEssays?.length > 0 &&
              essaySelectionData.aggregateEssays.map((essay, idx) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem',
                    width: '100%',
                    border: '1px solid',
                    borderRadius: '10px',
                    borderColor: 'primaryTons.border',
                    padding: '1rem',
                  }}
                >
                  <Typography variant="h6">{`${essay.materialName} - ${t(`abcp.step-3.${essay.type}`)}`}</Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '2rem',
                      width: '100%',
                    }}
                  >
                    <TextField
                      variant={
                        essaySelectionData.selectedEssays.find((element) => element.materialId === essay.materialId)
                          ?.specificMassValue
                          ? 'filled'
                          : 'standard'
                      }
                      sx={{ width: '100%' }}
                      key={`specificMass_${essay.materialName}`}
                      label={t('abcp.step-3.aggregate-specific-mass')}
                      value={
                        essaySelectionData.selectedEssays.find((element) => element.materialId === essay.materialId)
                          ?.specificMassValue
                      }
                      onChange={(e) => {
                        const prevData = { ...essaySelectionData };
                        prevData.aggregateEssays[idx].specificMass = Number(e.target.value);

                        const materialIndex = essaySelectionData.selectedEssays.findIndex(
                          (material) => material.materialId === essay.materialId
                        );

                        if (materialIndex === -1) {
                          const essayData = {
                            materialId: essay.materialId,
                            granulometryId: null,
                            specificMassValue: Number(e.target.value),
                            unitMassId: null,
                            materialType: essay.type,
                          };
                          prevData.selectedEssays.push(essayData);
                        } else {
                          prevData.selectedEssays[materialIndex] = {
                            ...prevData.selectedEssays[materialIndex],
                            specificMassValue: Number(e.target.value),
                          };
                        }
                        setData({ step: 2, value: prevData });
                      }}
                    />

                    <DropDown
                      variant={
                        essaySelectionData.selectedEssays.find((element) => element.materialId === essay.materialId)
                          ?.granulometryId
                          ? 'filled'
                          : 'standard'
                      }
                      sx={{ width: '100%' }}
                      key={`granulometry_${essay.materialName}`}
                      label={t('abcp.step-3.granulometry')}
                      defaultValue={granulometryDropdownDefault}
                      options={
                        essays?.aggregatesData[idx].granulometrys.length > 0
                          ? essays?.aggregatesData[idx].granulometrys.map((granulometry: IConcreteGranulometryDataId) => {
                              const { generalData, results, _id } = granulometry;
                              return {
                                label: `${generalData.name} - (Diâmetro nominal: ${results.nominal_diameter} mm)`,
                                value: _id,
                              };
                            })
                          : [
                              {
                                label: 'Não há granulometria disponível.',
                                value: '',
                              },
                            ]
                      }
                      callback={(value) => {
                        const prevData = { ...essaySelectionData };
                        const materialIndex = prevData.selectedEssays.findIndex(
                          (material) => material.materialId === essay.materialId
                        );

                        if (materialIndex === -1) {
                          const essayData = {
                            materialId: essay.materialId,
                            granulometryId: value as string,
                            specificMassValue: null,
                            materialType: essay.type,
                          };
                          prevData.selectedEssays.push(essayData);
                        } else {
                          prevData.selectedEssays[materialIndex] = {
                            ...prevData.selectedEssays[materialIndex],
                            granulometryId: value as string,
                          };
                        }

                        setData({ step: 2, value: prevData });
                      }}
                    />

                    {essay.type === 'coarseAggregate' && (
                      <DropDown
                        variant="standard"
                        sx={{ width: '100%' }}
                        key={`unitMass_${essay.materialName}_${idx}`}
                        label={t('abcp.step-3.unitMass')}
                        defaultValue={unitMassDropdownDefault}
                        options={
                          essays?.aggregatesData[idx].unitMasses.length > 0
                            ? essays?.aggregatesData[idx].unitMasses.map((unitMass: IConcreteUnitMassDataId) => {
                                const { generalData, result, _id } = unitMass;
                                return {
                                  label: `${generalData.experimentName} - (Diâmetro nominal: ${result.result} mm)`,
                                  value: _id,
                                };
                              })
                            : [
                                {
                                  label: 'Não há granulometria disponível.',
                                  value: '',
                                },
                              ]
                        }
                        callback={(value) => {
                          const prevData = { ...essaySelectionData };
                          const materialIndex = prevData.selectedEssays.findIndex(
                            (material) => material.materialId === essay.materialId
                          );

                          if (materialIndex === -1) {
                            const essayData = {
                              materialId: essay.materialId,
                              granulometryId: null,
                              specificMassValue: null,
                              unitMassId: value as string,
                              materialType: essay.type,
                            };
                            prevData.selectedEssays.push(essayData);
                          } else {
                            prevData.selectedEssays[materialIndex] = {
                              ...prevData.selectedEssays[materialIndex],
                              unitMassId: value as string,
                            };
                          }

                          setData({ step: 2, value: prevData });
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                border: '1px solid',
                borderRadius: '10px',
                borderColor: 'primaryTons.border',
                padding: '1rem',
              }}
            >
              <Typography variant="h6">{`${essays.cementData.name} - ${t(
                `abcp.step-3.${essays.cementData.type}`
              )}`}</Typography>

              <TextField
                variant="standard"
                sx={{ width: '50%' }}
                key={`specificMass_${essays.cementData.name}`}
                label={t('abcp.step-3.aggregate-specific-mass')}
                value={essaySelectionData.cementSpecificMass}
                onChange={(e) => {
                  setData({ step: 2, key: 'cementSpecificMass', value: Number(e.target.value) });
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ABCP_EssaySelection;
