import Igg_GeneralData from '@/components/asphalt/essays/igg/generalData.igg';
import Igg_Step2 from '@/components/asphalt/essays/igg/igg-step2.igg';
import Igg_Step3 from '@/components/asphalt/essays/igg/igg-step3.igg';
import Igg_Step4 from '@/components/asphalt/essays/igg/igg-step4.igg';
import Igg_Results from '@/components/asphalt/essays/igg/results.igg';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Igg_SERVICE from '@/services/asphalt/essays/igg/igg.service';
import useIggStore, { IggActions } from '@/stores/asphalt/igg/igg.store';

const Igg = () => {
  // start an instance of the service
  const igg = new Igg_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useIggStore();

  // set the userId to the service
  igg.userId = userId;

  // set the store to the service
  igg.store_actions = store as IggActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Igg_GeneralData igg={igg} />, data: store.generalData },
    { step: 1, children: <Igg_Step2 />, data: store },
    { step: 2, children: <Igg_Step3 />, data: store },
    { step: 3, children: <Igg_Step4 />, data: store },
    { step: 4, children: <Igg_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={igg.info} childrens={childrens} nextCallback={igg.handleNext} />;
  

};

export default Igg;
