import ElongatedParticles_GeneralData from '@/components/asphalt/essays/elongatedParticles/general-data.elongatedParticles';
import ElongatedParticles_Step2 from '@/components/asphalt/essays/elongatedParticles/step2.elongatedParticles';
import ElongatedParticles_Results from '@/components/asphalt/essays/elongatedParticles/results.elongatedParticles';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import ELONGATEDPARTICLES_SERVICE from '@/services/asphalt/essays/elongatedParticles/elongatedParticles.service';
import useElongatedParticlesStore, { ElongatedParticlesActions } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';

const ElongatedParticles = () => {
  // start an instance of the service
  const elongatedParticles = new ELONGATEDPARTICLES_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useElongatedParticlesStore();

  // set the userId to the service
  elongatedParticles.userId = userId;

  // set the store to the service
  elongatedParticles.store_actions = store as ElongatedParticlesActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <ElongatedParticles_GeneralData elongatedParticles={elongatedParticles} />, data: store.generalData },
    { step: 1, children: <ElongatedParticles_Step2 />, data: store },
    { step: 2, children: <ElongatedParticles_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={elongatedParticles.info} nextCallback={elongatedParticles.handleNext} childrens={childrens} />;
};

export default ElongatedParticles;
