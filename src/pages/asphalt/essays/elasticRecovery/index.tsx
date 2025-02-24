import ElasticRecovery_Calc from '@/components/asphalt/essays/elasticRecovery/elasticRecovery-calc';
import ElasticRecovery_GeneralData from '@/components/asphalt/essays/elasticRecovery/general-data.elasticRecovery';
import ElasticRecovery_Results from '@/components/asphalt/essays/elasticRecovery/results.elasticRecovery';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ElasticRecovery_SERVICE from '@/services/asphalt/essays/elasticRecovery/elasticRecovery.service';
import useElasticRecoveryStore, {
  ElasticRecoveryActions,
} from '@/stores/asphalt/elasticRecovery/elasticRecovery.store';

const ElasticRecovery = () => {
  // start an instance of the service
  const elasticRecovery = new ElasticRecovery_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useElasticRecoveryStore();

  // set the userId to the service
  elasticRecovery.userId = userId;

  // set the store to the service
  elasticRecovery.store_actions = store as ElasticRecoveryActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <ElasticRecovery_GeneralData elasticRecovery={elasticRecovery} />, data: store.generalData },
    { step: 1, children: <ElasticRecovery_Calc />, data: store },
    { step: 2, children: <ElasticRecovery_Results />, data: store },
  ];

  return (
    <EssayTemplate essayInfo={elasticRecovery.info} childrens={childrens} nextCallback={elasticRecovery.handleNext} />
  );
};

export default ElasticRecovery;
