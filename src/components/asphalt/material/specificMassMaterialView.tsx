import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card from "@/components/atoms/containers/result-card";
import { EssaysData } from "@/pages/asphalt/materials/material/[id]";
import { Box } from "@mui/material";
import { t } from "i18next";

export interface ISpecificMassMaterialView {
  specificMassData: EssaysData['specifyMassData']
}

const SpecificMassMaterialView = ({ specificMassData }: ISpecificMassMaterialView) => {

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

  return (
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
  );
};

export default SpecificMassMaterialView;
