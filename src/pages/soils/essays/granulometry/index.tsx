import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Granulometry_SERVICE from '@/services/soils/essays/granulometry/granulometry.service';
import useGranulometryStore, { GranulometryActions } from '@/stores/soils/granulometry/granulometry.store';
import Granulometry_GeneralData from '@/components/soils/essays/granulometry/general-data.granulometry';
import Granulometry_Step2 from '@/components/soils/essays/granulometry/step2.granulometry';
// import Granulometry_Results from '@/components/soils/essays/granulometry/results.granulometry';

const Granulometry = () => {
  // start an instance of the service
  const granulometry = new Granulometry_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useGranulometryStore();

  // set the userId to the service
  granulometry.userId = userId;

  // set the store to the service
  granulometry.store_actions = store as GranulometryActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Granulometry_GeneralData granulometry={granulometry} />, data: store.generalData },
    { step: 1, children: <Granulometry_Step2 />, data: store },
    // { step: 2, children: <Granulometry_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={granulometry.info} nextCallback={granulometry.handleNext} childrens={childrens} />;
};

export default Granulometry;
