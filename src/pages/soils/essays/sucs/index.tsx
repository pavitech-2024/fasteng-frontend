import React from 'react';
import EssayTemplate from '@/components/templates/essay';
import useSucsStore, { SucsActions } from '@/stores/soils/sucs/sucs.store';
import SUCS_SERVICE from '@/services/soils/essays/sucs/sucs.service';
import SUCS_GeneralData from '@/components/soils/essays/sucs/general-data.sucs';
// import SUCS_EssayGeneralData from '@/components/soils/essays/sucs/essay-general-data.sucs';
// import SUCS_Results from '@/components/soils/essays/sucs/results.sucs';
import useAuth from '@/contexts/auth';

const Sucs = () => {
    // start an instance of the service
    const sucs = new SUCS_SERVICE();
  
    // get the userId
    const {
      user: { _id: userId },
    } = useAuth();
  
    // get the store, could be empty or not ( in case of refresh page for example)
    const store = useSucsStore();
  
    // set the userId to the service
    sucs.userId = userId;
  
    // set the store to the service
    sucs.store_actions = store as SucsActions;
  
    // inform the childrens with the step of the children and the part of the store that they will use
    const childrens = [
      { step: 0, children: <SUCS_GeneralData sucs={sucs} />, data: store.generalData },
    //   { step: 1, children: <SUCS_EssayGeneralData />, data: store.essayGeneralData },
    //   { step: 2, children: <SUCS_Results />, data: store },
    ];
  
    return <EssayTemplate essayInfo={sucs.info} nextCallback={sucs.handleNext} childrens={childrens} />;
  };
  
  export default Sucs;
  