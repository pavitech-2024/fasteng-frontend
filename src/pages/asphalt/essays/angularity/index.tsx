import Angularity_GeneralData from '@/components/asphalt/essays/angularity/general-data.angularity';
import Angularity_Step2 from '@/components/asphalt/essays/angularity/step2.angularity';
import Angularity_Results from '@/components/asphalt/essays/angularity/results.angularity';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ANGULARITY_SERVICE from '@/services/asphalt/essays/angularity/angularity.service';
import useAngularityStore, { AngularityActions } from '@/stores/asphalt/angularity/angularity.store';

const Angularity = () => {
  // start an instance of the service
  const angularity = new ANGULARITY_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useAngularityStore();

  // set the userId to the service
  angularity.userId = userId;

  // set the store to the service
  angularity.store_actions = store as AngularityActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Angularity_GeneralData angularity={angularity} />, data: store.generalData },
    { step: 1, children: <Angularity_Step2 />, data: store },
    { step: 2, children: <Angularity_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={angularity.info} nextCallback={angularity.handleNext} childrens={childrens} />;
};

export default Angularity;
