import SandIncrease_GeneralData from '@/components/concrete/essays/sandIncrease/general-data.sand-increase';
import Sand_Increase_Results from '@/components/concrete/essays/sandIncrease/results.sand-increase';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import SAND_INCREASE_SERVICE from '@/services/concrete/essays/sandIncrease/sandIncrease.service';
import useSandIncreaseStore, { SandIncreaseActions } from '@/stores/concrete/sandIncrease/sandIncrease.store';

const SandIncrease = () => {
  const sandIncrease = new SAND_INCREASE_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useSandIncreaseStore();

  sandIncrease.userId = userId;

  sandIncrease.store_actions = store as SandIncreaseActions;

  const childrens = [
    {
      step: 0,
      children: <SandIncrease_GeneralData sandIncrease={sandIncrease} />,
      data: store.sandIncreaseGeneralData,
    },
    { step: 3, children: <Sand_Increase_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={sandIncrease.info} nextCallback={sandIncrease.handleNext} childrens={childrens} />;
};

export default SandIncrease;
