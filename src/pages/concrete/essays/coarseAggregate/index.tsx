import CoarseAggregate_GeneralData from '@/components/concrete/essays/coarseAggregate/general-data.coarseAggregate';
import CoarseAggregate_Step2 from '@/components/concrete/essays/coarseAggregate/step2.coarseAggregate';
import CoarseAggregate_Results from '@/components/concrete/essays/coarseAggregate/results.coarseAggregate';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import CORSE_AGGREGATE_SERVICE from '@/services/concrete/essays/coarseAggregate/coarseAggregate.service';
import useCoarseAggregateStore, {
  CoarseAggregateActions,
} from '@/stores/concrete/coarseAggregate/coarseAggregate.store';

const CoarseAggregate = () => {
  const coarseAggregate = new CORSE_AGGREGATE_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useCoarseAggregateStore();

  coarseAggregate.userId = userId;

  coarseAggregate.store_actions = store as CoarseAggregateActions;

  const childrens = [
    {
      step: 0,
      children: <CoarseAggregate_GeneralData coarseAggregate={coarseAggregate} />,
      data: store.generalData,
    },
    {
      step: 1,
      children: <CoarseAggregate_Step2 />,
      data: store.step2Data,
    },
    {
      step: 2,
      children: <CoarseAggregate_Results />,
      data: store.result,
    },
  ];

  return (
    <EssayTemplate essayInfo={coarseAggregate.info} nextCallback={coarseAggregate.handleNext} childrens={childrens} />
  );
};

export default CoarseAggregate;
