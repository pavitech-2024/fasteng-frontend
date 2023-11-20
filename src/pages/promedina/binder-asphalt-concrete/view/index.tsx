import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import  {GranularLayersActions} from '@/stores/promedina/granular-layers/granular-layers.store';
import useBinderAsphaltConcreteStore from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import BinderAsphaltConcrete_view from '@/components/promedina/binder-asphalt-concrete/view/sample-selection';
import BINDERASPHALTCONCRETEVIEW_SERVICE from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service';

const BinderAsphaltConcreteView = () => {
  const binderAsphaltConcrete = new BINDERASPHALTCONCRETEVIEW_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useBinderAsphaltConcreteStore();

  binderAsphaltConcrete.userId = userId;

  binderAsphaltConcrete.store_actions = store as GranularLayersActions;

  const childrens = [
    { step: 0, children: <BinderAsphaltConcrete_view />, data: store },
  ];

  return <EssayTemplate essayInfo={binderAsphaltConcrete.info} nextCallback={binderAsphaltConcrete.handleNext} childrens={childrens} />;
};

export default BinderAsphaltConcreteView;
