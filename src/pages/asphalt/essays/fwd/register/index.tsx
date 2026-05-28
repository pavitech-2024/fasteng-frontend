import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import FWD_step1 from '@/components/fwd/register/general-data.pm.bac';
import FWD_step2 from '@/components/fwd/register/step2.om.bac';
import FWD_step3 from '@/components/fwd/register/step3.pm.bac';
import FWDResume from '@/components/fwd/register/resume.pm.bac';
import useFWDStore from '@/stores/asphalt/fwd/fwd.store';
import FWD_SERVICE from '@/services/asphalt/essays/fwd/fwd.service';
import type { FWDStoreActions } from '@/services/asphalt/essays/fwd/fwd.service';

const FWD = () => {
  const fwdService = new FWD_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useFWDStore();

  fwdService.userId = userId;
  fwdService.store_actions = store as unknown as FWDStoreActions;

  const childrens = [
    { step: 0, children: <FWD_step1 />, data: { ...store.analysisData, samples: store.samples } },
    {
      step: 1,
      children: <FWD_step2 />,
      data: { analyses: store.analyses, drafts: store.drafts, selectedAnalysis: store.selectedAnalysis },
    },
    {
      step: 2,
      children: <FWD_step3 />,
      data: { selectedAnalysis: store.selectedAnalysis, procResult: store.procResult },
    },
    { step: 3, children: <FWDResume />, data: store },
  ];

  return (
    <EssayTemplate
      essayInfo={fwdService.info}
      nextCallback={fwdService.handleNext}
      childrens={childrens}
    />
  );
};

export default FWD;
