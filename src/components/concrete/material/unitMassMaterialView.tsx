import FlexColumnBorder from "@/components/atoms/containers/flex-column-with-border";
import Result_Card, { Result_CardContainer } from "@/components/atoms/containers/result-card";
import { EssaysData } from "@/pages/concrete/materials/material/[id]";
import { t } from "i18next";

export interface IUnitMassMaterialView {
  unitMassData: EssaysData['unitMassData'];
}

const UnitMassMaterialView = ({ unitMassData }: IUnitMassMaterialView) => {

  const unitMassResult = Number(unitMassData.result).toFixed(1);

  return (
    <FlexColumnBorder title={t('concrete.essays.unitMass')} open={true}>
        <Result_Card label={''} value={unitMassResult} unity={'Kg/L'} />
    </FlexColumnBorder>
  );
};

export default UnitMassMaterialView;
