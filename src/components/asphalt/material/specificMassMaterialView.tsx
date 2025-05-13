import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card, { Result_CardContainer } from '@/components/atoms/containers/result-card';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';
import { Box } from '@mui/material';
import { t } from 'i18next';

export interface ISpecificMassMaterialView {
  specificMassData: EssaysData['specifyMassData'];
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
      <Result_CardContainer>
        {data?.specificMassContainer?.map((item, index) => (
          <Result_Card key={index} label={item.label} value={item.value} unity={item.unity} />
        ))}
      </Result_CardContainer>
    </FlexColumnBorder>
  );
};

export default SpecificMassMaterialView;
