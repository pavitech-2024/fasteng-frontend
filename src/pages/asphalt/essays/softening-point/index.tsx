import SofteningPoint_GeneralData from '@/components/asphalt/essays/softening-point/general-data.softeningPoint';
import SofteningPoint_Results from '@/components/asphalt/essays/softening-point/results.softeningPoint';
import SofteningPoint_Calc from '@/components/asphalt/essays/softening-point/softeningPoint-calc.softeningPoint';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import SofteningPoint_SERVICE from '@/services/asphalt/essays/softeningPoint/softeningPoint.service';
import useSofteningPointStore, { SofteningPointActions } from '@/stores/asphalt/softeningPoint/softeningPoint.store';

const SofteningPoint = () => {
  // start an instance of the service
  const softeningPoint = new SofteningPoint_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useSofteningPointStore();

  // set the userId to the service
  softeningPoint.userId = userId;

  // set the store to the service
  softeningPoint.store_actions = store as SofteningPointActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <SofteningPoint_GeneralData softeningPoint={softeningPoint} />, data: store.generalData },
    { step: 1, children: <SofteningPoint_Calc />, data: store },
    { step: 2, children: <SofteningPoint_Results />, data: store },
  ];

  return (
    <EssayTemplate essayInfo={softeningPoint.info} childrens={childrens} nextCallback={softeningPoint.handleNext} />
  );
};

export default SofteningPoint;
