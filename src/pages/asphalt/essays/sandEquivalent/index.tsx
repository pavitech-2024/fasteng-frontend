import SandEquivalent_GeneralData from '@/components/asphalt/essays/sandEquivalent/general-data.sandEquivalent';
import SandEquivalent_Results from '@/components/asphalt/essays/sandEquivalent/results.sandEquivalent';
import SandEquivalent_Calc from '@/components/asphalt/essays/sandEquivalent/sandEquivalent-calc.sandEquivalent';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import SandEquivalent_SERVICE from '@/services/asphalt/essays/sandEquivalent/sandEquivalent.service';
import useSandEquivalentStore, { SandEquivalentActions } from '@/stores/asphalt/sandEquivalent/sandEquivalent.store';

const SandEquivalent = () => {
  // start an instance of the service
  const sandEquivalent = new SandEquivalent_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useSandEquivalentStore();

  // set the userId to the service
  sandEquivalent.userId = userId;

  // set the store to the service
  sandEquivalent.store_actions = store as SandEquivalentActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <SandEquivalent_GeneralData sandEquivalent={sandEquivalent} />, data: store.generalData },
    { step: 1, children: <SandEquivalent_Calc />, data: store },
    { step: 2, children: <SandEquivalent_Results />, data: store },
  ];

  return (
    <EssayTemplate essayInfo={sandEquivalent.info} childrens={childrens} nextCallback={sandEquivalent.handleNext} />
  );
};

export default SandEquivalent;
