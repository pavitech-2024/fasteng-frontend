import ViscosityRotational_GeneralData from '@/components/asphalt/essays/viscosityRotacional/general-data.viscosityRotational';
import ViscosityRotational_Results from '@/components/asphalt/essays/viscosityRotacional/results.viscosityRotational';
import ViscosityRotational_Calc from '@/components/asphalt/essays/viscosityRotacional/viscosityRotational-calc.viscosityRotational';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ViscosityRotational_SERVICE from '@/services/asphalt/essays/viscosityRotational/viscosityRotational.service';
import useViscosityRotationalStore, {
  ViscosityRotationalActions,
} from '@/stores/asphalt/viscosityRotational/viscosityRotational.store';

const ViscosityRotational = () => {
  const viscosityRotational = new ViscosityRotational_SERVICE();

  const {
    user: { _id: userId },
  } = useAuth();

  const store = useViscosityRotationalStore();

  viscosityRotational.userId = userId;

  viscosityRotational.store_actions = store as ViscosityRotationalActions;

  const childrens = [
    {
      step: 0,
      children: <ViscosityRotational_GeneralData viscosityRotational={viscosityRotational} />,
      data: store.generalData,
    },
    { step: 1, children: <ViscosityRotational_Calc />, data: store },
    { step: 2, children: <ViscosityRotational_Results />, data: store },
  ];

  return (
    <EssayTemplate
      essayInfo={viscosityRotational.info}
      childrens={childrens}
      nextCallback={viscosityRotational.handleNext}
    />
  );
};

export default ViscosityRotational;
