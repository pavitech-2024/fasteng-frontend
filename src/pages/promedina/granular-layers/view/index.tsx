import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import useGranularLayersStore, {GranularLayersActions} from '@/stores/promedina/granular-layers/granular-layers.store';
import GRANULARLAYERSVIEW_SERVICE from '@/services/promedina/granular-layers/granular-layers-view.service';
import GranularLayers_view from '@/components/promedina/granular-layers/view/sample-selection';

const GranularLayersView = () => {
  const granularLayers= new GRANULARLAYERSVIEW_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useGranularLayersStore();

  granularLayers.userId = userId;

  granularLayers.store_actions = store as GranularLayersActions;

  const childrens = [
    { step: 0, children: <GranularLayers_view />, data: store },
  ];

  return <EssayTemplate essayInfo={granularLayers.info} nextCallback={granularLayers.handleNext} childrens={childrens} />;
};

export default GranularLayersView;
