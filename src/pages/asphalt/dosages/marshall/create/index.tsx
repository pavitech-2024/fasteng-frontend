import Marshall_Step1 from '@/components/asphalt/dosages/marshall/step-1.marshall';
import Marshall_Step2 from '@/components/asphalt/dosages/marshall/step-2.marshall';
import Marshall_Step3 from '@/components/asphalt/dosages/marshall/step-3.marshall';
import Marshall_Step4 from '@/components/asphalt/dosages/marshall/step-4.marshall';
import Marshall_Step5 from '@/components/asphalt/dosages/marshall/step-5.marshall';
import Marshall_Step6 from '@/components/asphalt/dosages/marshall/step-6.marshall';
import Marshall_Step7 from '@/components/asphalt/dosages/marshall/step-7.marshall';
import Marshall_Step8 from '@/components/asphalt/dosages/marshall/step-8.marshall';
import Marshall_Step9 from '@/components/asphalt/dosages/marshall/step-9.marshall';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Marshall_SERVICE from '@/services/asphalt/dosages/marshall/marshall.service';
import useMarshallStore, { MarshallActions } from '@/stores/asphalt/marshall/marshall.store';

const Marshall = () => {
  // start an instance of the service
  const marshall = new Marshall_SERVICE();
  

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useMarshallStore();

  // set the userId to the service
  marshall.userId = userId;

  // set the store to the service
  marshall.store_actions = store as MarshallActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <Marshall_Step1 marshall={marshall} />, data: store },
    { step: 1, children: <Marshall_Step2 marshall={marshall} />, data: store },
    { step: 2, children: <Marshall_Step3 marshall={marshall} />, data: store },
    { step: 3, children: <Marshall_Step4 marshall={marshall} />, data: store },
    { step: 4, children: <Marshall_Step5 marshall={marshall} />, data: store },
    { step: 5, children: <Marshall_Step6 marshall={marshall} />, data: store },
    { step: 6, children: <Marshall_Step7 marshall={marshall} />, data: store },
    { step: 7, children: <Marshall_Step8 marshall={marshall} />, data: store },
    { step: 8, children: <Marshall_Step9 marshall={marshall} />, data: store },
  ];

  return <EssayTemplate essayInfo={marshall.info} childrens={childrens} nextCallback={marshall.handleNext} />;
};

export default Marshall;
