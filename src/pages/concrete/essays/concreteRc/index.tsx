import ConcreteRc_GeneralData from '@/components/concrete/essays/concreteRc/general-data.concreteRc';
import ConcreteRc_Results from '@/components/concrete/essays/concreteRc/results.concreteRc';
import ConcreteRc_Step2 from '@/components/concrete/essays/concreteRc/step2.concreteRc';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import CONCRETE_RC_SERVICE from '@/services/concrete/essays/concreteRc/concreteRc.service';
import useConcreteRcStore, { ConcreteRcActions } from '@/stores/concrete/concreteRc/concreteRc.store';

const ConcreteRc = () => {
  const concreteRc = new CONCRETE_RC_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useConcreteRcStore();

  concreteRc.userId = userId;

  concreteRc.store_actions = store as ConcreteRcActions;

  const childrens = [
    {
      step: 0,
      children: <ConcreteRc_GeneralData concreteRc={concreteRc} />,
      data: store.generalData,
    },
    {
      step: 1,
      children: <ConcreteRc_Step2 />,
      data: store,
    },
    {
      step: 2,
      children: <ConcreteRc_Results />,
      data: store,
    },
  ];

  return <EssayTemplate essayInfo={concreteRc.info} nextCallback={concreteRc.handleNext} childrens={childrens} />;
};

export default ConcreteRc;
