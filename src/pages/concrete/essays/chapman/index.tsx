import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import CHAPMAN_SERVICE from '@/services/concrete/essays/chapman/chapman.service';
import useChapmanStore, { ChapmanActions } from '@/stores/concrete/chapman.store';
import CHAPMAN_GeneralData from '../../../../components/concrete/essays/chapman/general-data.chapman';
import CHAPMAN_Step2 from '../../../../components/concrete/essays/chapman/step2.chapman';
import CHAPMAN_Results from '../../../../components/concrete/essays/chapman/results.chapman';

const Chapman = () => {
  // start an instance of the service
  const chapman = new CHAPMAN_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useChapmanStore();

  // set the userId to the service
  chapman.userId = userId;

  // set the store to the service
  chapman.store_actions = store as ChapmanActions;

  const childrens = [
    { step: 0, children: <CHAPMAN_GeneralData chapman={chapman} />, data: store.generalData },
    { step: 1, children: <CHAPMAN_Step2 />, data: store },
    { step: 2, children: <CHAPMAN_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={chapman.info} nextCallback={chapman.handleNext} childrens={childrens} />;
};

export default Chapman;
