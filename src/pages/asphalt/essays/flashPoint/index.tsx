import FlashPoint_Step2 from '@/components/asphalt/essays/flashPoint/step2.flashPoint';
import FlashPoint_Results from '@/components/asphalt/essays/flashPoint/results.flashPoint';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import FLASHPOINT_SERVICE from '@/services/asphalt/essays/flashPoint/flashPoint.service';
import useFlashPointStore, { FlashPointActions } from '@/stores/asphalt/flashPoint/flashPoint.store';
import FlashPoint_GeneralData from '@/components/asphalt/essays/flashPoint/gd.flashPoint';

const FlashPoint = () => {
  // start an instance of the service
  const flashPoint = new FLASHPOINT_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useFlashPointStore();

  // set the userId to the service
  flashPoint.userId = userId;

  // set the store to the service
  flashPoint.store_actions = store as FlashPointActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <FlashPoint_GeneralData flashPoint={flashPoint} />, data: store.generalData },
    { step: 1, children: <FlashPoint_Step2 />, data: store },
    { step: 2, children: <FlashPoint_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={flashPoint.info} nextCallback={flashPoint.handleNext} childrens={childrens} />;
};

export default FlashPoint;
