import React from 'react';
import EssayTemplate from '@/components/templates/essay';
import CBR_SERVICE from '@/services/soils/essays/cbr/cbr.service';
import CBR_GeneralData from '@/components/soils/essays/cbr/general-data.cbr';
import useCbrStore from '@/stores/soils/cbr/cbr.store';

const Cbr = () => {
  // start an instance of the service
  const cbr = new CBR_SERVICE();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useCbrStore();

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [{ step: 0, children: <CBR_GeneralData cbr={cbr} />, data: store.generalData }];

  return <EssayTemplate essayInfo={cbr.info} nextCallback={cbr.handleNext} childrens={childrens} />;
};

export default Cbr;