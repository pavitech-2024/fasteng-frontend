import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import BinderAsphaltConcrete_step1 from '@/components/promedina/binder-asphalt-concrete/register/general-data.pm.bac';
import BinderAsphaltConcrete_step3 from '@/components/promedina/binder-asphalt-concrete/register/step3.pm.bac';
import BinderAsphaltConcrete_step4 from '@/components/promedina/binder-asphalt-concrete/register/step4.pm.bac';
import BinderAsphaltConcrete_step5 from '@/components/promedina/binder-asphalt-concrete/register/step5.pm.bac';
import useBinderAsphaltConcreteStore, {
  BinderAsphaltConcreteActions,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import BINDER_ASPHALT_CONCRETE_SERVICE from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete.service';
import BinderAsphaltConcreteResume from '@/components/promedina/binder-asphalt-concrete/register/resume.pm.bac';

const BinderAsphaltConcrete = () => {
  const binderAsphaltConcrete = new BINDER_ASPHALT_CONCRETE_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useBinderAsphaltConcreteStore();

  binderAsphaltConcrete.userId = userId;
  binderAsphaltConcrete.store_actions = store as BinderAsphaltConcreteActions;

  const childrens = [
    { step: 0, children: <BinderAsphaltConcrete_step1 />, data: store.generalData },
    { step: 1, children: <BinderAsphaltConcrete_step3 />, data: store.step3Data },
    { step: 2, children: <BinderAsphaltConcrete_step4 />, data: store.step4Data },
    { step: 3, children: <BinderAsphaltConcrete_step5 />, data: store.step5Data },
    { step: 4, children: <BinderAsphaltConcreteResume />, data: store },
  ];

  return (
    <EssayTemplate essayInfo={binderAsphaltConcrete.info} nextCallback={binderAsphaltConcrete.handleNext} childrens={childrens} />
  );
};

export default BinderAsphaltConcrete;