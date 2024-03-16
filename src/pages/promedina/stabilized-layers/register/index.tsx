import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import StabilizedLayers_step1 from '@/components/promedina/stabilized-layers/register/general-data.pm.gl';
import StabilizedLayers_step2 from '@/components/promedina/stabilized-layers/register/step2.pm.gl';
import StabilizedLayers_step3 from '@/components/promedina/stabilized-layers/register/step3.pm.gl';
import useStabilizedLayersStore, {
  StabilizedLayersActions,
} from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import STABILIZEDLAYERS_SERVICE from '@/services/promedina/stabilized-layers/stabilized-layers.service';

const StabilizedLayers = () => {
  // start an instance of the service
  const stabilizedLayers = new STABILIZEDLAYERS_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useStabilizedLayersStore();

  // set the userId to the service
  stabilizedLayers.userId = userId;

  // set the store to the service
  stabilizedLayers.store_actions = store as StabilizedLayersActions;

  const childrens = [
    { step: 0, children: <StabilizedLayers_step1 />, data: store.generalData },
    { step: 1, children: <StabilizedLayers_step2 />, data: store },
    { step: 2, children: <StabilizedLayers_step3 />, data: store },
  ];

  return (
    <EssayTemplate essayInfo={stabilizedLayers.info} nextCallback={stabilizedLayers.handleNext} childrens={childrens} />
  );
};

export default StabilizedLayers;
