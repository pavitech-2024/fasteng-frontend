import Result_Card from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import Chart from 'react-google-charts';
import AsphaltGranulometry_resultsTable from '../../essays/granulometry/tables/results-table.granulometry';
import { useEffect, useState } from 'react';

const Superpave_Step3 = ({
  nextDisabled,
  setNextDisabled,
  superpave,
}: EssayPageProps & { superpave: Superpave_SERVICE }) => {
  const { granulometryResultsData: data } = useSuperpaveStore();
  console.log("🚀 ~ data:", data)

  const aggregatesCheckboxes = data.granulometrys.map((gran) => ({
    name: gran.material.name,
    type: gran.material.type,
  }));

  aggregatesCheckboxes.push({ name: data.viscosity.material.name, type: data.viscosity.material.type });

  const [materialsToShow, setMaterialToShow] = useState([]);
  console.log('🚀 ~ materialsToShow:', materialsToShow);

  const [aggregatesData, setAggregatesData] = useState([]);
  console.log('🚀 ~ aggregatesData:', aggregatesData);

  // useEffect(() => {
  //   if (aggregatesData.some((material) => material.name === data.viscosity.material.name)) {
  //     data.granulometrys.map((gran) => {
  //       aggregatesData.push(
  //         {
  //           label: t('granulometry-asphalt.accumulated-retained'),
  //           value: gran.accumulated_retained,
  //           unity: '%',
  //         },
  //         { label: t('granulometry-asphalt.total-retained'), value: gran.total_retained, unity: 'g' },
  //         {
  //           label: t('asphalt.essays.granulometry.results.nominalSize'),
  //           value: gran.nominal_size,
  //           unity: 'mm',
  //         },
  //         {
  //           label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
  //           value: gran.nominal_diameter,
  //           unity: 'mm',
  //         },
  //         {
  //           label: t('asphalt.essays.granulometry.results.finenessModule'),
  //           value: gran.fineness_module,
  //           unity: '%',
  //         },
  //         { label: t('granulometry-asphalt.cc'), value: gran.cc },
  //         { label: t('granulometry-asphalt.cnu'), value: gran.cnu },
  //         { label: t('granulometry-asphalt.error'), value: gran.error, unity: '%' }
  //       );
  //     });
  //   }
  // }, [aggregatesCheckboxes])

  // const graph_data = [
  //   [t('granulometry-asphalt.passant'), t('granulometry-asphalt.diameter')],
  //   ...granulometryResultsData.graph_data,
  // ];

  const granulometryRows = [];

  // granulometryEssayData.table_data.map((value, index) => {
  //   rows.push({
  //     sieve: value.sieve_label,
  //     passant_porcentage: value.passant,
  //     passant: granulometryResultsData.passant[index][1],
  //     retained_porcentage: granulometryResultsData.retained_porcentage[index][1],
  //     retained: value.retained,
  //     accumulated_retained: granulometryResultsData.accumulated_retained[index][1],
  //   });
  // });

  const granulometryColumns: GridColDef[] = [
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

  const handleCheckboxClick = (item: { name: string; type: string }) => {
    let newData = {material: null, data: []};
    if (materialsToShow.find((material) => material.material?.name === item.name)) {
      setMaterialToShow(materialsToShow.filter((material) => material.material?.name !== item.name));
    } else {
      data.granulometrys.find((gran) => {
        if (gran.material.name === item.name) {
          newData.data.push(
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
              label: t('asphalt.essays.granulometry.results.finenessModule'),
              value: gran.result.fineness_module,
              unity: '%',
            },
            { label: t('granulometry-asphalt.cc'), value: gran.result.cc },
            { label: t('granulometry-asphalt.cnu'), value: gran.result.cnu },
            { label: t('granulometry-asphalt.error'), value: gran.result.error, unity: '%' }
          );
          newData.material = gran.material;
        }
      });
      setMaterialToShow([...materialsToShow, newData]);
    }
  };

  // setNextDisabled(false);

  return (
    <>
      <Box>
        <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {aggregatesCheckboxes.map((item, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox onClick={() => handleCheckboxClick(item)} />}
              label={`${item.name} | ${item.type}`}
            />
          ))}
        </FormGroup>

        {/* {materialsToShow.map((item, index) => (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              mt: '20px',
            }}
          >
            <Typography variant="h5" sx={{ width: '100%', fontWeight: 'bold' }}>
              {item.name} | {item.type}
            </Typography>
            {aggregatesData.map((item, index) => (
              <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
            ))}
          </Box>
        ))} */}
        {materialsToShow.map((item, index) => (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              mt: '20px',
            }}
          >
            <Typography variant="h5" sx={{ width: '100%', fontWeight: 'bold' }}>
              {item.material?.name} | {item.material?.type}
            </Typography>
            {item.data.map((item, index) => {
              if (Array.isArray(item.value)) {
                return null;
              } else {
                return <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />;
              }
            })}
          </Box>
        ))}
      </Box>
      {/* <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '10px',
          mt: '20px',
        }}
      >
        {data.container_other_data.map((item, index) => {
          if (Array.isArray(item.value)) {
            return null;
          } else {
            return <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />;
          }
        })}
      </Box>

      <Chart
        chartType="LineChart"
        width={'100%'}
        height={'400px'}
        loader={<Loading />}
        data={graph_data}
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

      <AsphaltGranulometry_resultsTable rows={rows} columns={columns} /> */}
    </>
  );
};

export default Superpave_Step3;
