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
import usePenetrationStore from "@/stores/asphalt/penetration/penetration.store";
import useRtcdStore from "@/stores/asphalt/rtcd/rtcd.store";
import useRtfoStore from "@/stores/asphalt/rtfo/rtfo.store";
import useSandEquivalentStore from "@/stores/asphalt/sandEquivalent/sandEquivalent.store";
import useSayboltFurolStore from "@/stores/asphalt/sayboltFurol/sayboltFurol.store";
import useShapeIndexStore from "@/stores/asphalt/shapeIndex/shapeIndex.store";
import useSofteningPointStore from "@/stores/asphalt/softeningPoint/softeningPoint.store";
import useSpecifyMassStore from "@/stores/asphalt/specifyMass/specifyMass.store";
import useViscosityRotationalStore from "@/stores/asphalt/viscosityRotational/viscosityRotational.store";
import useCbrStore from "@/stores/soils/cbr/cbr.store";
import useCompressionStore from "@/stores/soils/compression/compression.store";
import useSoilsGranulometryStore from "@/stores/soils/granulometry/granulometry.store";
import useHrbStore from "@/stores/soils/hrb/hrb.store";

const useResetStores = () => {

  const essaysStores = [
    // asphalt stores
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

    // soil stores
    useCbrStore(),
    useCompressionStore(),
    useSoilsGranulometryStore(),
    useHrbStore()
  ]

  return () => {
    essaysStores.forEach(store => {
      store.reset();
    });
  };
};

export default useResetStores;
