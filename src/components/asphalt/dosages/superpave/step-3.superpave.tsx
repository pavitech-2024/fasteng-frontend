import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import { useEffect, useState } from 'react';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';

const Superpave_Step3_GranulometryResults = ({
  setNextDisabled,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryResultsData: data } = useSuperpaveStore();
  const [granulometryData, setGranulometryData] = useState([]);
  const [materialsToShow, setMaterialToShow] = useState([]);

  const aggregatesCheckboxes = data.granulometrys?.map((gran) => ({
    name: gran.material.name,
    type: gran.material.type,
  }));

  aggregatesCheckboxes?.push({ name: data.viscosity?.material.name, type: data.viscosity?.material.type });

  useEffect(() => {
    const newGranulometryData = data.granulometrys?.map((gran) => ({
      material: gran.material,
      graph: [[t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')], ...gran.result?.graph_data],
      data: [
        {
          label: t('granulometry-asphalt.accumulated-retained'),
          value: gran.result.accumulated_retained,
          unity: '%',
        },
        { label: t('granulometry-asphalt.total-retained'), value: gran.result.total_retained, unity: 'g' },
        {
          label: t('asphalt.essays.granulometry.results.nominalSize'),
          value: gran.result.nominal_size,
          unity: 'mm',
        },
        {
          label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
          value: gran.result.nominal_diameter,
          unity: 'mm',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-fineness-module'),
          value: gran.result.fineness_module,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-cc'),
          value: gran.result.cc,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-cnu'),
          value: gran.result.cnu,
          unity: '%',
        },
        {
          label: t('asphalt.dosages.superpave.granulometry-error'),
          value: gran.result.error,
          unity: '%',
        },
      ],
    }));
    setGranulometryData(newGranulometryData);
  }, []);

  const handleCheckboxClick = (item: { name: string; type: string }) => {
    if (materialsToShow.find((material) => material === item.name)) {
      setMaterialToShow(materialsToShow.filter((material) => material !== item.name));
    } else {
      setMaterialToShow([...materialsToShow, item.name]);
    }
  };

  setNextDisabled(false);

  return (
    <>
      <Box>
        <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {aggregatesCheckboxes?.map((item, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox onClick={() => handleCheckboxClick(item)} />}
              label={`${item.name} | ` + t(`asphalt.materials.${item.type}`)}
            />
          ))}
        </FormGroup>

        {granulometryData?.map((item, index) => {
          if (!materialsToShow.find((material) => material === item.material?.name)) {
            return null;
          } else {
            return (
              <FlexColumnBorder key={index} title={`${item.material?.name} | ` + t(`asphalt.materials.${item.material?.type}`)} open={true}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    mt: '20px',
                  }}
                  key={index}
                >
                  {item.data.map((item, index) => {
                    if (Array.isArray(item.value)) {
                      return null;
                    } else {
                      return <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />;
                    }
                  })}

                  <Chart
                    chartType="LineChart"
                    width={'100%'}
                    height={'400px'}
                    loader={<Loading />}
                    data={item.graph}
                    options={{
                      title: t('granulometry-asphalt.granulometry'),
                      backgroundColor: 'transparent',
                      pointSize: '5',
                      hAxis: {
                        title: `${t('granulometry-asphalt.sieve-openness') + ' (mm)'}`,
                        type: 'number',
                        scaleType: 'log',
                      },
                      vAxis: {
                        title: `${t('granulometry-asphalt.passant') + ' (%)'}`,
                        minValue: '0',
                        maxValue: '105',
                      },
                      legend: 'none',
                    }}
                  />
                </Box>
              </FlexColumnBorder>
            );
          }
        })}

        {materialsToShow.find((item) => item === data.viscosity.material.name) && data.viscosity.result && (
          <FlexColumnBorder title={`${data.viscosity.material.name} | ${data.viscosity.material.type}`} open={true}>
            <Typography variant="h6">{t('viscosity-rotational.compression-temperature')}</Typography>
            <Result_CardContainer sx={{ marginBottom: '2rem'}}>
              {Object.entries(data.viscosity.result.result.compressionTemperatureRange).map(([key, value], index) => (
                <Result_Card key={index} label={key} value={value.toFixed(2).toString()} unity={'°C'} />
              ))}
            </Result_CardContainer>

            <Typography variant="h6">{t('viscosity-rotational.aggregate-temperature')}</Typography>
            <Result_CardContainer sx={{ marginBottom: '2rem'}}>
              {Object.entries(data.viscosity.result.result.aggregateTemperatureRange).map(([key, value], index) => (
                <Result_Card key={index} label={key} value={value.toFixed(2).toString()} unity={'°C'} />
              ))}
            </Result_CardContainer>

            <Typography variant="h6">{t('viscosity-rotational.machining-temperature')}</Typography>
            <Result_CardContainer sx={{ marginBottom: '2rem'}}>
              {Object.entries(data.viscosity.result.result.machiningTemperatureRange).map(([key, value], index) => (
                <Result_Card key={index} label={key} value={value.toFixed(2).toString()} unity={'°C'} />
              ))}
            </Result_CardContainer>

            <Typography variant="h6">{t('asphalt.essays.viscosityRotational.graph')}</Typography>
            <Chart
              chartType="LineChart"
              width={'100%'}
              height={'400px'}
              loader={<Loading />}
              data={data.viscosity.result.result.curvePoints}
              options={{
                backgroundColor: 'transparent',
                hAxis: {
                  title: `${t('asphalt.essays.viscosityRotational.temperature')} C`, // Umidade %
                },
                vAxis: {
                  title: `${t('asphalt.essays.viscosityRotational.viscosity')} (SSF)`, // Densidade do solo seco - g/cm³
                  maxValue: '1.5',
                },
                explorer: {
                  actions: ['dragToZoom', 'rightClickToReset'],
                  axis: 'vertical',
                },
                legend: 'none',
                trendlines: {
                  0: {
                    type: 'polynomial',
                    degree: 4,
                    visibleInLegend: true,
                    labelInLegend: 'curva',
                  },
                },
              }}
            />
          </FlexColumnBorder>
        )}
      </Box>
    </>
  );
};

export default Superpave_Step3_GranulometryResults;
