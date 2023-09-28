import ADHESIVENESS_GeneralData from '@/components/asphalt/essays/adhesiveness/general-data.adhesiveness';
import ADHESIVENESS_Results from '@/components/asphalt/essays/adhesiveness/results.adhesiveness';
import ADHESIVENESS_Step2 from '@/components/asphalt/essays/adhesiveness/step2.adhesiveness';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ADHESIVENESS_SERVICE from '@/services/asphalt/essays/adhesiveness/adhesiveness.service';
import useAdhesivenessStore, { AdhesivenessActions } from '@/stores/asphalt/adhesiveness.store';

const Adhesiveness = () => {
  // start an instance of the service
  const adhesiveness = new ADHESIVENESS_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useAdhesivenessStore();

  // set the userId to the service
  adhesiveness.userId = userId;

  // set the store to the service
  adhesiveness.store_actions = store as AdhesivenessActions;

  const childrens = [
    { step: 0, children: <ADHESIVENESS_GeneralData adhesiveness={adhesiveness} />, data: store.generalData },
    { step: 1, children: <ADHESIVENESS_Step2 />, data: store },
    { step: 2, children: <ADHESIVENESS_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={adhesiveness.info} nextCallback={adhesiveness.handleNext} childrens={childrens} />;
};

export default Adhesiveness;
