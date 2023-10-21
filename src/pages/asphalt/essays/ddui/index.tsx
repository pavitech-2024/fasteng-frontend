import Ddui_Step2 from '@/components/asphalt/essays/ddui/ddui-step2.ddui';
import Ddui_Step3 from '@/components/asphalt/essays/ddui/ddui-step3.ddui';
import Ddui_GeneralData from '@/components/asphalt/essays/ddui/generalData.ddui';
import Ddui_Results from '@/components/asphalt/essays/ddui/results.ddui';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Ddui_SERVICE from '@/services/asphalt/essays/ddui/ddui.service';
import useDduiStore, { DduiActions } from '@/stores/asphalt/ddui.store';

const Ddui = () => {
  // start an instance of the service
  const ddui = new Ddui_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useDduiStore();

  // set the userId to the service
  ddui.userId = userId;

  // set the store to the service
  ddui.store_actions = store as DduiActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Ddui_GeneralData ddui={ddui} />, data: store.generalData },
    { step: 1, children: <Ddui_Step2 />, data: store },
    { step: 2, children: <Ddui_Step3 />, data: store },
    { step: 2, children: <Ddui_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={ddui.info} childrens={childrens} nextCallback={ddui.handleNext} />;
};

export default Ddui;
