import Rtfo_GeneralData from "@/components/asphalt/essays/rtfo/general-data.rtfo";
import Rtfo_Results from "@/components/asphalt/essays/rtfo/results.rtfo";
import Rtfo_Calc from "@/components/asphalt/essays/rtfo/rtfo-calc.rtfo";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import Rtfo_SERVICE from "@/services/asphalt/essays/rtfo/rtfo.service";
import useRtfoStore, { RtfoActions } from "@/stores/asphalt/rtfo/rtfo.store";

const Rtfo = () => {
  // start an instance of the service
  const rtfo = new Rtfo_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useRtfoStore();

  // set the userId to the service
  rtfo.userId = userId;

  // set the store to the service
  rtfo.store_actions = store as RtfoActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Rtfo_GeneralData rtfo={rtfo} />, data: store.generalData },
    { step: 1, children: <Rtfo_Calc />, data: store },
    { step: 2, children: <Rtfo_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={rtfo.info} childrens={childrens} nextCallback={rtfo.handleNext} />;
};

export default Rtfo;
