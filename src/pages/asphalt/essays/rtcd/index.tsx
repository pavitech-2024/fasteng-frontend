import EssayTemplate from '@/components/templates/essay';
import Rtcd_Step2 from '@/components/asphalt/essays/rtcd/rtcd-step2.rtcd';
import Rtcd_Step3 from '@/components/asphalt/essays/rtcd/rtcd-step3.rtcd';
import Rtcd_Results from '@/components/asphalt/essays/rtcd/results.rtcd';
import Rtcd_GeneralData from '@/components/asphalt/essays/rtcd/generalData.rtcd';
import useAuth from '@/contexts/auth';
import Rtcd_SERVICE from '@/services/asphalt/essays/rtcd/rtcd.service';
import useRtcdStore, { RtcdActions } from '@/stores/asphalt/rtcd.store';

const Rtcd = () => {
  // start an instance of the service
  const rtcd = new Rtcd_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useRtcdStore();

  // set the userId to the service
  rtcd.userId = userId;

  // set the store to the service
  rtcd.store_actions = store as RtcdActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Rtcd_GeneralData rtcd={rtcd} />, data: store.generalData },
    { step: 1, children: <Rtcd_Step2 />, data: store },
    { step: 2, children: <Rtcd_Step3 />, data: store },
    { step: 3, children: <Rtcd_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={rtcd.info} childrens={childrens} nextCallback={rtcd.handleNext} />;
};

export default Rtcd;
