import SayboltFurol_GeneralData from '@/components/asphalt/essays/sayboltFurol/general-data.sayboltFurol';
import SayboltFurol_Results from '@/components/asphalt/essays/sayboltFurol/results.sayboltFurol';
import SayboltFurol_Calc from '@/components/asphalt/essays/sayboltFurol/sayboltFurol-calc.sayboltFurol';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import SayboltFurol_SERVICE from '@/services/asphalt/essays/saybolt-furol/sayboltFurol.service';
import useSayboltFurolStore, { SayboltFurolActions } from '@/stores/asphalt/sayboltFurol/sayboltFurol.store';

const SayboltFurol = () => {
  // start an instance of the service
  const sayboltFurol = new SayboltFurol_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useSayboltFurolStore();

  // set the userId to the service
  sayboltFurol.userId = userId;

  // set the store to the service
  sayboltFurol.store_actions = store as SayboltFurolActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <SayboltFurol_GeneralData sayboltFurol={sayboltFurol} />, data: store.generalData },
    { step: 1, children: <SayboltFurol_Calc />, data: store },
    { step: 2, children: <SayboltFurol_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={sayboltFurol.info} childrens={childrens} nextCallback={sayboltFurol.handleNext} />;
};

export default SayboltFurol;
