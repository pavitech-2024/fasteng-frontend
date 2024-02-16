import ABCP_GeneralData from '@/components/concrete/dosages/abcp/step-1-general-data';
import ABCP_MaterialsSelection from '@/components/concrete/dosages/abcp/step-2-materials-selection';
import ABCP_EssaySelection from '@/components/concrete/dosages/abcp/step-3-essays-selection';
import ABCP_InsertingParams from '@/components/concrete/dosages/abcp/step-4-inserting-params';
import ABCP_Results from '@/components/concrete/dosages/abcp/step-5-dosage-resume';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCPActions } from '@/stores/concrete/abcp/abcp.store';
import { NextPage } from 'next';

const DosageABCP: NextPage = () => {
  const abcp = new ABCP_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useABCPStore();

  abcp.userId = userId;

  abcp.store_actions = store as ABCPActions;

  const childrens = [
    { step: 0, children: <ABCP_GeneralData />, data: store.generalData },
    { step: 1, children: <ABCP_MaterialsSelection abcp={abcp} />, data: store },
    { step: 2, children: <ABCP_EssaySelection abcp={abcp} />, data: store },
    { step: 3, children: <ABCP_InsertingParams abcp={abcp} />, data: store },
    { step: 4, children: <ABCP_Results abcp={abcp} />, data: store },
  ];

  return <EssayTemplate essayInfo={abcp.info} nextCallback={abcp.handleNext} childrens={childrens}></EssayTemplate>;
};

export default DosageABCP;
