import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import GranularLayers_step1 from '@/components/promedina/granular-layers/register/general-data.pm.gl';
import GranularLayers_step3 from '@/components/promedina/granular-layers/register/step3.pm.gl';
import useGranularLayersStore, {
  GranularLayersActions
} from '@/stores/promedina/granular-layers/granular-layers.store';
import GRANULARLAYERS_SERVICE from '@/services/promedina/granular-layers/granular-layers.service';
import GranularLayersResume from '@/components/promedina/granular-layers/register/resume.pm.gl';

const GranularLayers = () => {
  const granularLayers = new GRANULARLAYERS_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useGranularLayersStore();

  granularLayers.userId = userId;
  granularLayers.store_actions = store as GranularLayersActions;

  const childrens = [
    { step: 0, children: <GranularLayers_step1 />, data: store.generalData },
    { step: 1, children: <GranularLayers_step3 />, data: store.step2Data },
    { step: 2, children: <GranularLayersResume />, data: store },
  ];

  return (
    <EssayTemplate essayInfo={granularLayers.info} nextCallback={granularLayers.handleNext} childrens={childrens} />
  );
};

export default GranularLayers;