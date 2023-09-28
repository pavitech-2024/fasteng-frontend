import Abrasion_Calc from "@/components/asphalt/essays/abrasion/abrasion-calc.abrasion";
import Abrasion_GeneralData from "@/components/asphalt/essays/abrasion/general-data.abrasion";
import Abrasion_Results from "@/components/asphalt/essays/abrasion/results.abrasion";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Abrasion_SERVICE from "@/services/asphalt/essays/abrasion/abrasion.service";
import useAbrasionStore, { AbrasionActions } from "@/stores/asphalt/abrasion.store";

const Abrasion = () => {
  // start an instance of the service
  const abrasion = new Abrasion_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useAbrasionStore();

  // set the userId to the service
  abrasion.userId = userId;

  // set the store to the service
  abrasion.store_actions = store as AbrasionActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Abrasion_GeneralData abrasion={abrasion} />, data: store.generalData },
    { step: 1, children: <Abrasion_Calc />, data: store },
    { step: 2, children: <Abrasion_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={abrasion.info} childrens={childrens} nextCallback={abrasion.handleNext} />;
};

export default Abrasion;