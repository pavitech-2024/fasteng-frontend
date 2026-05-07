import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import IggGeneralData from '@/components/promedina/IGG/register/general-data.pm.gl';
import IggStationsDefects from '@/components/promedina/IGG/register/stations-defects.igg';
import IggResults from '@/components/promedina/IGG/register/results.igg';
import { useIggStore, IggAnalysisActions } from '@/stores/promedina/igg/igg.store';
import IGG_SERVICE from '@/services/promedina/igg/igg.service';

const IGG = () => {
  const iggService = new IGG_SERVICE();
  const { user: { _id: userId } } = useAuth();
  const store = useIggStore();

  iggService.userId = userId;
  iggService.store_actions = store as IggAnalysisActions;

  const childrens = [
    { step: 0, children: <IggGeneralData />, data: store.generalData },
    { step: 1, children: <IggStationsDefects />, data: store }, // ✅ MUDA PRA store INTEIRO!
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