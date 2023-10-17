import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import GranularLayers_step1 from '@/components/promedina/granular-layers/view/general-data.pm.gl';
import GranularLayers_step2 from '@/components/promedina/granular-layers/view/step2.pm.gl';
import GranularLayers_step3 from '@/components/promedina/granular-layers/view/step3.pm.gl';
import useGranularLayersStore, {GranularLayersActions} from '@/stores/promedina/granular-layers/granular-layers.store';
import GRANULARLAYERS_SERVICE from '@/services/promedina/granular-layers/granular-layers.service';

const GranularLayers = () => {
  // start an instance of the service
  const granularLayers = new GRANULARLAYERS_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useGranularLayersStore();

  // set the userId to the service
  granularLayers.userId = userId;

  // set the store to the service
  granularLayers.store_actions = store as GranularLayersActions;

  const childrens = [
    { step: 0, children: <GranularLayers_step1  />, data: store.generalData },
    { step: 1, children: <GranularLayers_step2 granularLayers={granularLayers} />, data: store },
    { step: 2, children: <GranularLayers_step3 granularLayers={granularLayers}/>, data: store },
  ];

  return <EssayTemplate essayInfo={granularLayers.info} nextCallback={granularLayers.handleNext} childrens={childrens} />;
};

export default GranularLayers;
