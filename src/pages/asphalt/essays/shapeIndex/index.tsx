import ShapeIndex_GeneralData from '@/components/asphalt/essays/shapeIndex/general-data.shapeIndex';
import ShapeIndex_Step2 from '@/components/asphalt/essays/shapeIndex/step2.shapeIndex';
import ShapeIndex_Results from '@/components/asphalt/essays/shapeIndex/results.shapeIndex';
import EssayTemplate from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import SHAPEINDEX_SERVICE from '@/services/asphalt/essays/shapeIndex/shapeIndex.service';
import useShapeIndexStore, { ShapeIndexActions } from '@/stores/asphalt/shapeIndex/shapeIndex.store';

const ShapeIndex = () => {
  // start an instance of the service
  const shapeIndex = new SHAPEINDEX_SERVICE();

  // get the userId
  const {
    user: { _id: userId },
  } = useAuth();

  // get the store, could be empty or not ( in case of refresh page for example)
  const store = useShapeIndexStore();

  // set the userId to the service
  shapeIndex.userId = userId;

  // set the store to the service
  shapeIndex.store_actions = store as ShapeIndexActions;

  // inform the childrens with the step of the children and the part of the store that they will use
  const childrens = [
    { step: 0, children: <ShapeIndex_GeneralData shapeIndex={shapeIndex} />, data: store.generalData },
    { step: 1, children: <ShapeIndex_Step2 />, data: store },
    { step: 2, children: <ShapeIndex_Results />, data: store },
  ];

  return <EssayTemplate essayInfo={shapeIndex.info} nextCallback={shapeIndex.handleNext} childrens={childrens} />;
};

export default ShapeIndex;
