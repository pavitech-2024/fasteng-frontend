import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import StabilizedLayers_step1 from '@/components/promedina/stabilized-layers/register/general-data.pm.gl';
import StabilizedLayers_step3 from '@/components/promedina/stabilized-layers/register/step3.pm.gl';
import useStabilizedLayersStore, { StabilizedLayersActions } from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import STABILIZEDLAYERS_SERVICE from '@/services/promedina/stabilized-layers/stabilized-layers.service';
import StabilizedLayersResume from '@/components/promedina/stabilized-layers/register/resume.pm.stabilized-layers';

const StabilizedLayers = () => {
  const stabilizedLayers = new STABILIZEDLAYERS_SERVICE();
  const { user: { _id: userId } } = useAuth();
  const store = useStabilizedLayersStore();
  stabilizedLayers.userId = userId;
  stabilizedLayers.store_actions = store as StabilizedLayersActions;

  const childrens = [
    { step: 0, children: <StabilizedLayers_step1 />, data: store.generalData },
    { step: 1, children: <StabilizedLayers_step3 />, data: store.step2Data },
    { step: 2, children: <StabilizedLayersResume />, data: store },
  ];

  return <EssayTemplate essayInfo={stabilizedLayers.info} nextCallback={stabilizedLayers.handleNext} childrens={childrens} />;
};

export default StabilizedLayers;