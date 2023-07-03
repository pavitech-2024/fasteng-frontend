import React from 'react';
import EssayTemplate from '@/components/templates/essay';
import useCbrStore, { CbrActions } from '@/stores/soils/cbr/cbr.store';
import CBR_SERVICE from '@/services/soils/essays/cbr/cbr.service';
import CBR_GeneralData from '@/components/soils/essays/cbr/general-data.cbr';
import CBR_Step2 from '@/components/soils/essays/cbr/step2.cbr';
import CBR_Expansion from '@/components/soils/essays/cbr/step3.cbr';
import CBR_Results from '@/components/soils/essays/cbr/results.cbr';
import useAuth from '@/contexts/auth';

const Cbr = () => {
  // start an instance of the service
  const cbr = new CBR_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useCbrStore();

  // set the userId to the service
  cbr.userId = userId;

  // set the store to the service
  cbr.store_actions = store as CbrActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <CBR_GeneralData cbr={cbr} />, data: store.generalData },
    { step: 1, children: <CBR_Step2 />, data: store.step2Data },
    { step: 2, children: <CBR_Expansion />, data: store },
    { step: 3, children: <CBR_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={cbr.info} nextCallback={cbr.handleNext} childrens={childrens} />;
};

export default Cbr;
