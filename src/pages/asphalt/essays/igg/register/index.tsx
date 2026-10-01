import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import IggGeneralData from '@/components/igg/register/general-data.pm.gl';
import IggStationsDefects from '@/components/igg/register/stations-defects.igg';
import IggResults from '@/components/igg/register/results.igg';
import { UseIggStore, IggAnalysisActions } from '@/stores/asphalt/igg/igg.store';
import IGG_SERVICE from '@/services/asphalt/essays/igg/igg.service';

const IGG = () => {
  const iggService = new IGG_SERVICE();
  const { user: { _id: userId } } = useAuth();
  const store = UseIggStore();

  iggService.userId = userId;
  iggService.store_actions = store as IggAnalysisActions;

  const childrens = [
    { step: 0, children: <IggGeneralData />, data: store.generalData },
    { step: 1, children: <IggStationsDefects />, data: store },
    { step: 2, children: <IggResults />, data: store },
  ];

  return (
    <EssayTemplate 
      essayInfo={iggService.info} 
      nextCallback={iggService.handleNext} 
      childrens={childrens} 
    />
  );
};

export default IGG;