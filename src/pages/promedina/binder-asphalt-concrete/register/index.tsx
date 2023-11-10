import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import useBinderAsphaltConcreteStore, {
  BinderAsphaltConcreteActions,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import BinderAsphaltConcrete_step1 from '@/components/promedina/binder-asphalt-concrete/view/general-data.pm.bac';
import BinderAsphaltConcrete_step2 from '@/components/promedina/binder-asphalt-concrete/view/step2.pm.bac';
import BinderAsphaltConcrete_step3 from '@/components/promedina/binder-asphalt-concrete/view/step3.pm.bac';
import BinderAsphaltConcrete_step4 from '@/components/promedina/binder-asphalt-concrete/view/step4.pm.bac';
import BINDER_ASPHALT_CONCRETE_SERVICE from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete.service';

const BinderAsphaltConcrete = () => {
  // start an instance of the service
  const binderAsphaltConcrete = new BINDER_ASPHALT_CONCRETE_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useBinderAsphaltConcreteStore();

  // set the userId to the service
  binderAsphaltConcrete.userId = userId;

  // set the store to the service
  binderAsphaltConcrete.store_actions = store as BinderAsphaltConcreteActions;

  const childrens = [
    { step: 0, children: <BinderAsphaltConcrete_step1 />, data: store.generalData },
    { step: 1, children: <BinderAsphaltConcrete_step2 />, data: store },
    { step: 2, children: <BinderAsphaltConcrete_step3 />, data: store },
    { step: 3, children: <BinderAsphaltConcrete_step4 />, data: store },
  ];

  return (
    <EssayTemplate
      essayInfo={binderAsphaltConcrete.info}
      nextCallback={binderAsphaltConcrete.handleNext}
      childrens={childrens}
    />
  );
};

export default BinderAsphaltConcrete;
