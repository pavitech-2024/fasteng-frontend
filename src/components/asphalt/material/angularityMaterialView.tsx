import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import ResultSubTitle from "@/components/atoms/titles/result-sub-title";
import StepDescription from "@/components/atoms/titles/step-description";
import { Box } from "@mui/material";
import { t } from "i18next";
import Angularity_resultsTable from "../essays/angularity/tables/results-table.angularity";
import { EssaysData } from "@/pages/asphalt/materials/material/[id]";
import { row_results } from "@/stores/asphalt/angularity/angularity.store";
import { GridColDef } from "@mui/x-data-grid";

export interface IAngularityMaterialView {
  angularityData: EssaysData['angularityData']
}

const AngularityMaterialView = ({ angularityData }: IAngularityMaterialView) => {

  const data = {
    // container "Resultados"
    container_other_data: [],
  };

  if (angularityData.results) {
    data.container_other_data.push({
      label: t('angularity.average_angularity'),
      value: angularityData.results.averageOfAll,
      unity: '%',
    });
  }

  const rows: row_results[] = [];

  angularityData.results.angularities.map((value) => {
    const { label, angularity } = value;
    rows.push({
      label,
      angularity,
    });
  });

  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: '',
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'angularity',
      headerName: t('angularity.angularity') + ' (%)',
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  return (
    <FlexColumnBorder title={t('asphalt.essays.angularity')} open={true}>
      {angularityData.results.alerts.map((item, index) => (
        <StepDescription key={`alert-${index}`} text={item} warning />
      ))}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        {data.container_other_data.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Box>
      <Angularity_resultsTable rows={rows} columns={columns} />
    </FlexColumnBorder>
  );
};

export default AngularityMaterialView;
