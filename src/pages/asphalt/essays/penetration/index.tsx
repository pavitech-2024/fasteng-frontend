import Penetration_GeneralData from "@/components/asphalt/essays/penetration/general-data.penetration";
import Penetration_Calc from "@/components/asphalt/essays/penetration/penetration-calc.penetration";
import Penetration_Results from "@/components/asphalt/essays/penetration/results.penetration";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Penetration_SERVICE from "@/services/asphalt/essays/penetration/penetration.service";
import usePenetrationStore, { PenetrationActions } from "@/stores/asphalt/penetration/penetration.store";

const Penetration = () => {
  // start an instance of the service
  const penetration = new Penetration_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = usePenetrationStore();

  // set the userId to the service
  penetration.userId = userId;

  // set the store to the service
  penetration.store_actions = store as PenetrationActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Penetration_GeneralData penetration={penetration} />, data: store.generalData },
    { step: 1, children: <Penetration_Calc />, data: store },
    { step: 2, children: <Penetration_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={penetration.info} childrens={childrens} nextCallback={penetration.handleNext} />;
};

export default Penetration;