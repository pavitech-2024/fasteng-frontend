import Fwd_GeneralData from '@/components/asphalt/essays/fwd/generalData.fwd';
import Fwd_Step2 from '@/components/asphalt/essays/fwd/fwd-step2.fwd';
import Fwd_Step3 from '@/components/asphalt/essays/fwd/fwd-step3.fwd';
import Fwd_Step4 from '@/components/asphalt/essays/fwd/fwd-step4.fwd';
import Fwd_Results from '@/components/asphalt/essays/fwd/results.fwd';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Fwd_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import useFwdStore, { FwdActions } from '@/stores/asphalt/fwd/fwd.store';

const Fwd = () => {
  // start an instance of the service
  const fwd = new Fwd_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useFwdStore();

  // set the userId to the service
  fwd.userId = userId;

  // set the store to the service
  fwd.store_actions = store as FwdActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Fwd_GeneralData fwd={fwd} />, data: store.generalData },
    { step: 1, children: <Fwd_Step2 />, data: store },
    { step: 2, children: <Fwd_Step3 />, data: store },
    { step: 3, children: <Fwd_Step4 />, data: store },
    { step: 4, children: <Fwd_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={fwd.info} childrens={childrens} nextCallback={fwd.handleNext} />;
};

export default Fwd;
