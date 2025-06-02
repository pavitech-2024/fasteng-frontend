
import Superpave_Step1 from '@/components/asphalt/dosages/superpave/step-1.superpave';
import Superpave_Step10 from '@/components/asphalt/dosages/superpave/step-10.superpave';
import Superpave_Step11 from '@/components/asphalt/dosages/superpave/step-11.superpave';
import Superpave_Step12 from '@/components/asphalt/dosages/superpave/step-12.superpave';
import Superpave_Step13 from '@/components/asphalt/dosages/superpave/step-13.superpave';
import Superpave_Step2 from '@/components/asphalt/dosages/superpave/step-2.superpave';
import Superpave_Step3 from '@/components/asphalt/dosages/superpave/step-3.superpave';
import Superpave_Step4 from '@/components/asphalt/dosages/superpave/step-4.superpave';
import Superpave_Step5 from '@/components/asphalt/dosages/superpave/step-5.superpave';
import Superpave_Step6 from '@/components/asphalt/dosages/superpave/step-6.superpave';
import Superpave_Step8 from '@/components/asphalt/dosages/superpave/step-8.superpave';
import Superpave_Step9 from '@/components/asphalt/dosages/superpave/step-9.superpave';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';

const Superpave = () => {
  // start an instance of the service
  const superpave = new Superpave_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useSuperpaveStore();

  // set the userId to the service
  superpave.userId = userId;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Superpave_Step1 superpave={superpave} />, data: store },
    { step: 1, children: <Superpave_Step2 superpave={superpave} />, data: store },
    { step: 2, children: <Superpave_Step3 superpave={superpave} />, data: store },
    { step: 3, children: <Superpave_Step4 superpave={superpave} />, data: store },
    { step: 4, children: <Superpave_Step5 superpave={superpave} />, data: store },
    { step: 5, children: <Superpave_Step6 superpave={superpave} />, data: store },
    // { step: 6, children: <Superpave_Step7 superpave={superpave} />, data: store },
    { step: 7, children: <Superpave_Step8 superpave={superpave} />, data: store },
    { step: 8, children: <Superpave_Step9 superpave={superpave} />, data: store },
    { step: 9, children: <Superpave_Step10 superpave={superpave} />, data: store },
    { step: 10, children: <Superpave_Step11 superpave={superpave} />, data: store },
    { step: 11, children: <Superpave_Step12 superpave={superpave} />, data: store },
    { step: 12, children: <Superpave_Step13 superpave={superpave} />, data: store },
  ];

  return <EssayTemplate essayInfo={superpave.info} childrens={childrens} nextCallback={superpave.handleNext} />;
};

export default Superpave;
