import Superpave_Step1 from "@/components/asphalt/dosages/superpave/step-1.superpave";
import Superpave_Step3 from "@/components/asphalt/dosages/superpave/step-2.superpave";
import Superpave_Step2 from "@/components/asphalt/dosages/superpave/step-2.superpave";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Superpave_SERVICE from "@/services/asphalt/dosages/superpave/superpave.service"
import useSuperpaveStore, { SuperpaveActions } from "@/stores/asphalt/superpave/superpave.store";

const Superpave = () => {
  // start an instance of the service
  const superpave = new Superpave_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useSuperpaveStore();

  // set the userId to the service
  superpave.userId = userId;

  // set the store to the service
  superpave.store_actions = store as SuperpaveActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Superpave_Step1 superpave={superpave} />, data: store },
    { step: 1, children: <Superpave_Step2 superpave={superpave} />, data: store },
    { step: 2, children: <Superpave_Step3 superpave={superpave} />, data: store },
  ];

  return <EssayTemplate essayInfo={superpave.info} childrens={childrens} nextCallback={superpave.handleNext} />;
};

export default Superpave;