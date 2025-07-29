
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import Superpave_SERVICE from '@/services/asphalt/dosages/superpave/superpave.service';
import useSuperpaveStore from '@/stores/asphalt/superpave/superpave.store';
import Superpave_Step1_GeneralData from '@/components/asphalt/dosages/superpave/step-1.superpave';
import Superpave_Step2_GranulometryEssay from '@/components/asphalt/dosages/superpave/step-2.superpave';
import Superpave_Step3_GranulometryResults from '@/components/asphalt/dosages/superpave/step-3.superpave';
import Superpave_Step4_GranulometryComposition from '@/components/asphalt/dosages/superpave/step-4.superpave';
import Superpave_Step5_InitialBinder from '@/components/asphalt/dosages/superpave/step-5.superpave';
import Superpave_Step6_FirstCompaction from '@/components/asphalt/dosages/superpave/step-6.superpave';
import Superpave_Step7_FirstCompactionParams from '@/components/asphalt/dosages/superpave/step-7.superpave';
import Superpave_Step8_ChosenCurvePercents from '@/components/asphalt/dosages/superpave/step-8.superpave';
import Superpave_Step9_SecondCompaction from '@/components/asphalt/dosages/superpave/step-9.superpave';
import Superpave_Step10_SecondCompactionParams from '@/components/asphalt/dosages/superpave/step-10.superpave';
import Superpave_Step11_ConfirmCompaction from '@/components/asphalt/dosages/superpave/step-11.superpave.confirm-compaction';
import Superpave_Step12_ResumeDosage from '@/components/asphalt/dosages/superpave/step-12.superpave.resume-dosage';

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
    { step: 0, children: <Superpave_Step1_GeneralData superpave={superpave} />, data: store },
    { step: 1, children: <Superpave_Step2_GranulometryEssay superpave={superpave} />, data: store },
    { step: 2, children: <Superpave_Step3_GranulometryResults superpave={superpave} />, data: store },
    { step: 3, children: <Superpave_Step4_GranulometryComposition superpave={superpave} />, data: store },
    { step: 4, children: <Superpave_Step5_InitialBinder superpave={superpave} />, data: store },
    { step: 5, children: <Superpave_Step6_FirstCompaction superpave={superpave} />, data: store },
    { step: 6, children: <Superpave_Step7_FirstCompactionParams superpave={superpave} />, data: store },
    { step: 7, children: <Superpave_Step8_ChosenCurvePercents superpave={superpave} />, data: store },
    { step: 8, children: <Superpave_Step9_SecondCompaction superpave={superpave} />, data: store },
    { step: 9, children: <Superpave_Step10_SecondCompactionParams superpave={superpave} />, data: store },
    { step: 10, children: <Superpave_Step11_ConfirmCompaction superpave={superpave} />, data: store },
    { step: 11, children: <Superpave_Step12_ResumeDosage superpave={superpave} />, data: store },
  ];

  return <EssayTemplate essayInfo={superpave.info} childrens={childrens} nextCallback={superpave.handleNext} />;
};

export default Superpave;
