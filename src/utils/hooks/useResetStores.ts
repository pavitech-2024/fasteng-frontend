import useAbrasionStore from "@/stores/asphalt/abrasion/abrasion.store";
import useAdhesivenessStore from "@/stores/asphalt/adhesiveness/adhesiveness.store";
import useAngularityStore from "@/stores/asphalt/angularity/angularity.store";
import useDduiStore from "@/stores/asphalt/ddui/ddui.store";
import useDuctilityStore from "@/stores/asphalt/ductility/ductility.store";
import useElasticRecoveryStore from "@/stores/asphalt/elasticRecovery/elasticRecovery.store";
import useElongatedParticlesStore from "@/stores/asphalt/elongatedParticles/elongatedParticles.store";
import useFlashPointStore from "@/stores/asphalt/flashPoint/flashPoint.store";
import useFwdStore from "@/stores/asphalt/fwd/fwd.store";
import useAsphaltGranulometryStore from "@/stores/asphalt/granulometry/asphalt-granulometry.store";
import useIggStore from "@/stores/asphalt/igg/igg.store";
import useMarshallStore from "@/stores/asphalt/marshall/marshall.store";
import usePenetrationStore from "@/stores/asphalt/penetration/penetration.store";
import useRtcdStore from "@/stores/asphalt/rtcd/rtcd.store";
import useRtfoStore from "@/stores/asphalt/rtfo/rtfo.store";
import useSandEquivalentStore from "@/stores/asphalt/sandEquivalent/sandEquivalent.store";
import useSayboltFurolStore from "@/stores/asphalt/sayboltFurol/sayboltFurol.store";
import useShapeIndexStore from "@/stores/asphalt/shapeIndex/shapeIndex.store";
import useSofteningPointStore from "@/stores/asphalt/softeningPoint/softeningPoint.store";
import useSpecifyMassStore from "@/stores/asphalt/specifyMass/specifyMass.store";
import useSuperpaveStore from "@/stores/asphalt/superpave/superpave.store";
import useViscosityRotationalStore from "@/stores/asphalt/viscosityRotational/viscosityRotational.store";
import useABCPStore from "@/stores/concrete/abcp/abcp.store";
import useChapmanStore from "@/stores/concrete/chapman/chapman.store";
import useCoarseAggregateStore from "@/stores/concrete/coarseAggregate/coarseAggregate.store";
import useConcreteRcStore from "@/stores/concrete/concreteRc/concreteRc.store";
import useConcreteRtStore from "@/stores/concrete/concreteRt/concreteRt.store";
import useConcreteGranulometryStore from "@/stores/concrete/granulometry/granulometry.store";
import useSandIncreaseStore from "@/stores/concrete/sandIncrease/sandIncrease.store";
import useUnitMassStore from "@/stores/concrete/unitMass/unitMass.store";
import useCbrStore from "@/stores/soils/cbr/cbr.store";
import useCompressionStore from "@/stores/soils/compression/compression.store";
import useSoilsGranulometryStore from "@/stores/soils/granulometry/granulometry.store";
import useHrbStore from "@/stores/soils/hrb/hrb.store";
import useSucsStore from "@/stores/soils/sucs/sucs.store";

/**
 * useResetStores
 * 
 * Returns a function that resets all the stores that hold data for the essays.
 * This function is used when the user navigate from one essay to another, 
 * so that the data of the previous
 * essay is not kept in memory.
 */
const useResetStores = () => {

  const essaysStores = [
    // asphalt
    useAbrasionStore(),
    useAdhesivenessStore(),
    useDuctilityStore(),
    useAngularityStore(),
    usePenetrationStore(),
    useRtfoStore(),
    useSandEquivalentStore(),
    useAsphaltGranulometryStore(),
    useShapeIndexStore(),
    useSpecifyMassStore(),
    useElongatedParticlesStore(),
    useSofteningPointStore(),
    useFlashPointStore(),
    useElasticRecoveryStore(),
    useViscosityRotationalStore(),
    useSayboltFurolStore(),
    useRtcdStore(),
    useFwdStore(),
    useDduiStore(),
    useIggStore(),
    useMarshallStore(),
    useSuperpaveStore(),

    // soil
    useCbrStore(),
    useCompressionStore(),
    useSoilsGranulometryStore(),
    useHrbStore(),
    useSucsStore(),
    

    // concrete
    useConcreteGranulometryStore(),
    useChapmanStore(),
    useUnitMassStore(),
    useSandIncreaseStore(),
    useCoarseAggregateStore(),
    useConcreteRtStore(),
    useConcreteRcStore(),
    useABCPStore()
  ];

  return () => {
    essaysStores.forEach(essay => {
      essay.reset();
    });
  };
};

export default useResetStores;