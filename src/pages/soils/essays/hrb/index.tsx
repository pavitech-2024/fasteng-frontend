import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import HRB_SERVICE from '@/services/soils/essays/hrb/hrb.service';
import useHrbStore, { HrbActions } from '@/stores/soils/hrb/hrb.store';

const Hrb = () => {
  // start an instance of the service
  const hrb = new HRB_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useHrbStore();

  // set the userId to the service
  hrb.userId = userId;

  // set the store to the serviceq
  hrb.store_actions = store as HrbActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [];

  return <EssayTemplate essayInfo={hrb.info} nextCallback={hrb.handleNext} childrens={childrens} />;
};

export default Hrb;
