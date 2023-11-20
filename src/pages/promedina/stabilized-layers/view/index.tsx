import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import  {GranularLayersActions} from '@/stores/promedina/granular-layers/granular-layers.store';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import StabilizedLayers_view from '@/components/promedina/stabilized-layers/view/sample-selection';
import STABILIZEDLAYERSVIEW_SERVICE from '@/services/promedina/stabilized-layers/stabilized-layers-view.service';

const StabilizedLayersView = () => {
  const stabilizedlayers = new STABILIZEDLAYERSVIEW_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useStabilizedLayersStore();

  stabilizedlayers.userId = userId;

  stabilizedlayers.store_actions = store as GranularLayersActions;

  const childrens = [
    { step: 0, children: <StabilizedLayers_view />, data: store },
  ];

  return <EssayTemplate essayInfo={stabilizedlayers.info} nextCallback={stabilizedlayers.handleNext} childrens={childrens} />;
};

export default StabilizedLayersView;
