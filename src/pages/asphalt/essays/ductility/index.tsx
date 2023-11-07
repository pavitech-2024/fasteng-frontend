import Ductility_GeneralData from '@/components/asphalt/essays/ductility/general-data.ductility';
import Ductility_Step2 from '@/components/asphalt/essays/ductility/step2.ductility';
import Ductility_Results from '@/components/asphalt/essays/ductility/results.ductility';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import DUCTILITY_SERVICE from '@/services/asphalt/essays/ductility/ductility.service';
import useDuctilityStore, { DuctilityActions } from '@/stores/asphalt/ductility/ductility.store';

const Ductility = () => {
  // start an instance of the service
  const ductility = new DUCTILITY_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useDuctilityStore();

  // set the userId to the service
  ductility.userId = userId;

  // set the store to the service
  ductility.store_actions = store as DuctilityActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Ductility_GeneralData ductility={ductility} />, data: store.generalData },
    { step: 1, children: <Ductility_Step2 />, data: store },
    { step: 2, children: <Ductility_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={ductility.info} nextCallback={ductility.handleNext} childrens={childrens} />;
};

export default Ductility;
