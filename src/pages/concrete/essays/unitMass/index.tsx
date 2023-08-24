import UnitMass_GeneralData from "@/components/concrete/essays/unitMass/general-data.unitMass";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import UNITMASS_SERVICE from "@/services/concrete/essays/unitMass/unitMass.service";
import useUnitMassStore, { UnitMassActions } from "@/stores/concrete/unitMass/unitMass.store";

const UnitMass = () => {
  const unitMass = new UNITMASS_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useUnitMassStore();

  unitMass.userId = userId;

  unitMass.store_actions = store as UnitMassActions;

  const childrens = [
    { step: 0, children: <UnitMass_GeneralData unitMass={unitMass} />, data: store.generalData },
    //{ step: 1, children: <UnitMass_Step2/>, data: store.step2Data },
    //{ step: 2, children: <UnitMass_Result />, data: store },
  ];

  return <EssayTemplate essayInfo={unitMass.info} nextCallback={unitMass.handleNext} childrens={childrens} />;
};

export default UnitMass;
