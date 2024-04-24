import ElongatedParticles_results_Dimensions_Table from '@/components/asphalt/essays/elongatedParticles/tables/results-dimensions-table.elongatedParticles';
import AsphaltGranulometry_resultsTable from '@/components/asphalt/essays/granulometry/tables/results-table.granulometry';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { ElongatedParticlesData } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import { AsphaltGranulometryData } from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { ShapeIndexData } from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { SpecifyMassData } from '@/stores/asphalt/specifyMass/specifyMass.store';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Chart from 'react-google-charts';

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

export type EssaysData = {
  asphaltGranulometryData: AsphaltGranulometryData;
  specifyMassData: SpecifyMassData;
  shapeIndexData: ShapeIndexData;
  elongatedParticlesData: ElongatedParticlesData;
};
interface IEssaysData {
  essayName: string;
  data: EssaysData;
}

const Material = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id.toString();
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<{ material: AsphaltMaterial; essays: IEssaysData[] }>();
  console.log('🚀 ~ Material ~ material:', material);
  let graph_data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await materialsService.getMaterial('650de742205bb691362b7e7c');
        setMaterial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
      }
    };
    fetchData();
  }, [id]);

  const rows = [];

  const granulometryData: EssaysData['asphaltGranulometryData'] = material?.essays.some(
    (essay) => essay.essayName === 'granulometry'
  )
    ? (material.essays.find((essay) => essay.essayName === 'granulometry')
        .data as unknown as EssaysData['asphaltGranulometryData'])
    : undefined;

  const specificMassData: SpecifyMassData = material?.essays.some((essay) => essay.essayName === 'specificMass')
    ? (material.essays.find((essay) => essay.essayName === 'specificMass')
        .data as unknown as EssaysData['specifyMassData'])
    : undefined;

  const shapeIndexData: ShapeIndexData = material?.essays.some((essay) => essay.essayName === 'shapeIndex')
    ? (material.essays.find((essay) => essay.essayName === 'shapeIndex')
        .data as unknown as EssaysData['shapeIndexData'])
    : undefined;

  const elongatedParticlesData: ElongatedParticlesData = material?.essays.some((essay) => essay.essayName ==='elongatedParticles')
    ? (material.essays.find((essay) => essay.essayName === 'elongatedParticles')
        .data as unknown as EssaysData['elongatedParticlesData'])
    : undefined;

  if (granulometryData) {
    graph_data = [
      [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
      ...granulometryData.results.graph_data,
    ];

    granulometryData.step2Data.table_data.map((value, index) => {
      rows.push({
        sieve: value.sieve_label,
        passant_porcentage: value.passant,
        passant: granulometryData.results.passant[index][1],
        retained_porcentage: granulometryData.results.retained_porcentage[index][1],
        retained: value.retained,
        accumulated_retained: granulometryData.results.accumulated_retained[index][1],
      });
    });
  }

  const data = {
    specificMassContainer: [],
    shapeIndexContainer: [],
  };

  if (specificMassData) {
    data.specificMassContainer.push(
      { label: t('specifyMass.bulk_specify_mass'), value: specificMassData.results.bulk_specify_mass, unity: 'g/cm³' },
      {
        label: t('specifyMass.apparent_specify_mass'),
        value: specificMassData.results.apparent_specify_mass,
        unity: 'g/cm³',
      },
      { label: t('specifyMass.absorption'), value: specificMassData.results.absorption, unity: '%' }
    );
  }

  if (shapeIndexData) {
    data.shapeIndexContainer.push({
      label: t('shapeIndex.shapeIndex'),
      value: shapeIndexData.results.shape_index,
      unity: '',
    });
  }

  let elongatedParticlesRows;

  if (elongatedParticlesData) {
    elongatedParticlesRows = elongatedParticlesData?.results.results_dimensions_table_data;
  }

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ elongatedParticlesData:", elongatedParticlesData)
  },[material])

  const columns: GridColDef[] = [
    {
      field: 'sieve',
      headerName: t('granulometry-asphalt.sieves'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant_porcentage',
      headerName: t('granulometry-asphalt.passant') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'passant',
      headerName: t('granulometry-asphalt.passant') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained_porcentage',
      headerName: t('granulometry-asphalt.retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'retained',
      headerName: t('granulometry-asphalt.retained') + ' (g)',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'accumulated_retained',
      headerName: t('granulometry-asphalt.accumulated-retained') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  const elongatedParticlesColumns: GridColDef[] = [
    {
      field: 'ratio',
      headerName: t('elongatedParticles.ratio'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'particles_percentage',
      headerName: t('elongatedParticles.particles-percentage'),
      valueFormatter: ({ value }) => `${value}%`,
    },
  ];

  const TextBox = ({ children }: TextBoxProps) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'no-wrap',
        fontSize: { mobile: '.85rem', notebook: '1rem' },
        color: 'primaryTons.mainGray',
      }}
    >
      {children}
    </Box>
  );

  return (
    <>
      {material === undefined ? (
        <Loading />
      ) : (
        <>
          <BodyEssay>
            <Box
              sx={{
                width: { mobile: '90%', notebook: '80%' },
                maxWidth: '2200px',
                padding: '2rem',
                borderRadius: '20px',
                bgcolor: 'primaryTons.white',
                border: '1px solid',
                borderColor: 'primaryTons.border',
                marginTop: '5rem',
              }}
            >
              <FlexColumnBorder title={t('general data of essay')} open={true}>
                <Box
                  sx={{
                    display: 'flex',
                    padding: { mobile: '10px', notebook: '25px' },
                    mb: { mobile: '-55px', notebook: '-45px' },
                    transform: { mobile: 'translateY(-70px)', notebook: 'translateY(-60px)' },
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <TextBox>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('asphalt.matyerial.name')}:</span>
                      <Typography>{material.material.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('asphalt.matyerial.type')}:</span>
                      <Typography>{material.material.type}</Typography>
                    </Box>
                  </TextBox>
                </Box>
              </FlexColumnBorder>

              {granulometryData.results && (
                <FlexColumnBorder title={t('asphalt.essays.granulometry')} open={true}>
                  <AsphaltGranulometry_resultsTable rows={rows} columns={columns} />
                  <Chart
                    chartType="LineChart"
                    width={'100%'}
                    height={'400px'}
                    loader={<Loading />}
                    data={graph_data}
                    options={{
                      title: t('granulometry-asphalt.granulometry'),
                      backgroundColor: 'transparent',
                      pointSize: '2',
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
                </FlexColumnBorder>
              )}

              {specificMassData?.results && (
                <FlexColumnBorder title={t('asphalt.essays.specifyMass')} open={true}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
                      gap: '10px',
                      mt: '20px',
                    }}
                  >
                    {data?.specificMassContainer?.map((item, index) => (
                      <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
                    ))}
                  </Box>
                </FlexColumnBorder>
              )}

              {shapeIndexData?.results && (
                <FlexColumnBorder title={t('asphalt.essays.shapeIndex')} open={true}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
                      gap: '10px',
                      mt: '20px',
                    }}
                  >
                    {data.shapeIndexContainer.map((item, index) => (
                      <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
                    ))}
                  </Box>
                </FlexColumnBorder>
              )}

                <FlexColumnBorder title={t('asphalt.essays.elongatedParticles')} open={true}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      gridTemplateColumns: { mobile: '1fr', notebook: '1fr' },
                      gap: '10px',
                      mt: '20px',
                    }}
                  >
                    <ElongatedParticles_results_Dimensions_Table rows={elongatedParticlesRows} columns={elongatedParticlesColumns} />
                  </Box>
                </FlexColumnBorder>
            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default Material;
