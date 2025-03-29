import AsphaltGranulometry_GeneralData from '@/components/asphalt/essays/granulometry/general-data.granulometry';
import AsphaltGranulometry_Results from '@/components/asphalt/essays/granulometry/results.granulometry';
import AsphaltGranulometry_Step2 from '@/components/asphalt/essays/granulometry/step2.granulometry';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { StoreActions } from '@/interfaces/common/stores/storeActions.interface';
import AsphaltGranulometry_SERVICE from '@/services/asphalt/essays/granulometry/granulometry.service';
import useAsphaltGranulometryStore from '@/stores/asphalt/granulometry/asphalt-granulometry.store';

const AsphaltGranulometry = () => {
  // start an instance of the service
  const granulometry = new AsphaltGranulometry_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useAsphaltGranulometryStore();

  // set the userId to the service
  granulometry.userId = userId;

  // set the store to the service
  granulometry.store_actions = store as StoreActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <AsphaltGranulometry_GeneralData granulometry={granulometry} />, data: store.generalData },
    { step: 1, children: <AsphaltGranulometry_Step2 />, data: store },
    { step: 2, children: <AsphaltGranulometry_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={granulometry.info} nextCallback={granulometry.handleNext} childrens={childrens} />;
};

export default AsphaltGranulometry;
