import Marshall_GeneralData from "@/components/asphalt/dosages/marshall/step-1-general-data.marshall";
import Marshall_MaterialsSelection from "@/components/asphalt/dosages/marshall/step-2-material-selection";
import Marshall_GranulometryComposition from "@/components/asphalt/dosages/marshall/step-3-granulometry-composition";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Marshall_SERVICE from "@/services/asphalt/dosages/marshall/marshall.service"
import useMarshallStore, { MarshallActions } from "@/stores/asphalt/marshall/marshall.store";

const Marshall = () => {
  // start an instance of the service
  const marshall = new Marshall_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useMarshallStore();

  // set the userId to the service
  marshall.userId = userId;

  // set the store to the service
  marshall.store_actions = store as MarshallActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Marshall_GeneralData marshall={marshall} />, data: store.generalData },
    { step: 1, children: <Marshall_MaterialsSelection marshall={marshall} />, data: store },
    { step: 2, children: <Marshall_GranulometryComposition marshall={marshall} />, data: store },
  ];

  return <EssayTemplate essayInfo={marshall.info} childrens={childrens} nextCallback={marshall.handleNext} />;
};

export default Marshall;