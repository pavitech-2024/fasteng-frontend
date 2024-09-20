"use client"

import ConcreteRt_GeneralData from "@/components/concrete/essays/concreteRt/general-data.concreteRt";
import ConcreteRt_Results from "@/components/concrete/essays/concreteRt/results.concreteRt";
import ConcreteRt_Step2 from "@/components/concrete/essays/concreteRt/step2.concreteRt";
import EssayTemplate from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import CONCRETE_RT_SERVICE from "@/services/concrete/essays/concreteRt/concreteRt.service";
import useConcreteRtStore, { ConcreteRtActions } from "@/stores/concrete/concreteRt/concreteRt.store";


const ConcreteRt = () => {
    const concreteRt = new CONCRETE_RT_SERVICE();
  
    const {
      user: { _id: userId },
    } = useAuth();
  
    const store = useConcreteRtStore();
  
    concreteRt.userId = userId;
  
    concreteRt.store_actions = store as ConcreteRtActions;
  
    const childrens = [
      {
        step: 0,
        children: <ConcreteRt_GeneralData concreteRT={concreteRt} />,
        data: store.generalData,
      },
      {
        step: 1,
        children: <ConcreteRt_Step2 />,
        data: store.step2Data,
      },
      {
        step: 2,
        children: <ConcreteRt_Results />,
        data: store.results,
      },
    ];
  
    return (
      <EssayTemplate essayInfo={concreteRt.info} nextCallback={concreteRt.handleNext} childrens={childrens} />
    );
  };
  
  export default ConcreteRt;
  