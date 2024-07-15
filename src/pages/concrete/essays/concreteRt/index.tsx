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
        children: <ConcreteRt_GeneralData concreteRt={concreteRt} />,
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
        data: store.result,
      },
    ];
  
    return (
      <EssayTemplate essayInfo={concreteRt.info} nextCallback={concreteRt.handleNext} childrens={childrens} />
    );
  };
  
  export default ConcreteRt;
  