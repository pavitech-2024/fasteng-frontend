import SpecifyMass_GeneralData from '@/components/asphalt/essays/specifyMass/general-data.specifyMass';
import SpecifyMass_Results from '@/components/asphalt/essays/specifyMass/results.specifyMass';
import SpecifyMass_Step2 from '@/components/asphalt/essays/specifyMass/step2.specifyMass';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import SPECIFYMASS_SERVICE from '@/services/asphalt/essays/specifyMass/specifyMass.service';
import useSpecifyMassStore, { SpecifyMassActions } from '@/stores/asphalt/specifyMass/specifyMass.store';

const SpecifyMass = () => {
  // start an instance of the service
  const specifyMass = new SPECIFYMASS_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useSpecifyMassStore();

  // set the userId to the service
  specifyMass.userId = userId;

  // set the store to the service
  specifyMass.store_actions = store as SpecifyMassActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <SpecifyMass_GeneralData specifyMass={specifyMass} />, data: store.generalData },
    { step: 1, children: <SpecifyMass_Step2 />, data: store },
    { step: 2, children: <SpecifyMass_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={specifyMass.info} nextCallback={specifyMass.handleNext} childrens={childrens} />;
};

export default SpecifyMass;
