// components/templates/material/Material.tsx
import { Box } from '@mui/material';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import GeneratePDF from '@/components/generatePDF/materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';
import MaterialResume from '@/components/molecules/boxes/material-resume';

// Componentes de visualização de ensaios
import GranulometryMateriaView from '@/components/asphalt/material/granulometryMaterialView';
import ShapeIndexMaterialView from '@/components/asphalt/material/shapeIndexMaterialView';
import SpecificMassMaterialView from '@/components/asphalt/material/specificMassMaterialView';
import ElongatedParticlesMaterialView from '@/components/asphalt/material/elongatedParticesMaterialView';
import AdhesivenessMaterialView from '@/components/asphalt/material/adhesivenessMaterialView';
import LosAngelesAbrasionMaterialView from '@/components/asphalt/material/abrasionMaterialView';
import SandEquivalentMaterialView from '@/components/asphalt/material/sandEquivalentMaterialView';
import AngularityMaterialView from '@/components/asphalt/material/angularityMaterialView';
import ViscosityRotationalMaterialView from '@/components/asphalt/material/viscosityRotationalMaterialView';
import PenetrationMaterialView from '@/components/asphalt/material/penetrationMaterialView';
import SofteningPointMaterialView from '@/components/asphalt/material/softeningPointMaterialView';
import FlashPointMaterialView from '@/components/asphalt/material/flashPointMaterialView';
import DuctilityMaterialView from '@/components/asphalt/material/ductilityMaterialView';
import RtfoMaterialView from '@/components/asphalt/material/rtfoMaterialView';
import ElasticRecoveryMaterialView from '@/components/asphalt/material/elasticRecoveryMaterialView';
import { MaterialEssaysHistory } from './history/MaterialEssaysHistory';
import { useMaterialData } from './hook/useMaterialData';

const Material = () => {
  const { loading, material, materialState, materialType, granulometryEssays, hasContent } = useMaterialData();

  if (loading) {
    return <Loading />;
  }

  const materialResumeData = {
    name: material?.material?.name,
    type: materialType,
  };

  return (
    <BodyEssay>
      <Box sx={{
        width: { mobile: '90%', notebook: '80%' },
        maxWidth: '2200px',
        padding: '2rem',
        borderRadius: '20px',
        bgcolor: 'primaryTons.white',
        border: '1px solid',
        borderColor: 'primaryTons.border',
        marginTop: '5rem',
      }}>
        {hasContent && (
          <Box sx={{ width: 'fit-content', padding: '0 0 2rem 0' }}>
            <GeneratePDF
              name={material.material.name}
              type={materialType}
              granulometryData={materialState.granulometryData}
              specificMassData={materialState.specificMassData}
              shapeIndexData={materialState.shapeIndexData}
              elongatedParticlesData={materialState.elongatedParticlesData}
              adhesivenessData={materialState.adhesivenessData}
              losAngelesAbrasionData={materialState.losAngelesAbrasionData}
              sandEquivalentData={materialState.sandEquivalentData}
              angularityData={materialState.angularityData}
              viscosityRotationalData={materialState.viscosityRotationalData}
              penetrationData={materialState.penetrationData}
              softeningPointData={materialState.softeningPointData}
              flashPointData={materialState.flashPointData}
              ductilityData={materialState.ductilityData}
              rtfoData={materialState.rtfoData}
              elasticRecoveryData={materialState.elasticRecoveryData}
            />
          </Box>
        )}

        <MaterialResume data={materialResumeData} />

        {/* Histórico de Ensaios de Granulometria */}
        <MaterialEssaysHistory granulometryEssays={granulometryEssays} />

        {/* Renderização condicional dos ensaios */}
        {materialState.granulometryData?.results && <GranulometryMateriaView granulometryData={materialState.granulometryData} />}
        {materialState.specificMassData?.results && <SpecificMassMaterialView specificMassData={materialState.specificMassData} />}
        {materialState.shapeIndexData?.results && <ShapeIndexMaterialView shapeIndexData={materialState.shapeIndexData} />}
        {materialState.elongatedParticlesData?.results && (
          <ElongatedParticlesMaterialView elongatedParticlesData={materialState.elongatedParticlesData} />
        )}
        {materialState.adhesivenessData?.results && <AdhesivenessMaterialView adhesivenessData={materialState.adhesivenessData} />}
        {materialState.losAngelesAbrasionData?.results && (
          <LosAngelesAbrasionMaterialView losAngelesAbrasionData={materialState.losAngelesAbrasionData} />
        )}
        {materialState.sandEquivalentData?.results && <SandEquivalentMaterialView sandEquivalentData={materialState.sandEquivalentData} />}
        {materialState.angularityData?.results && <AngularityMaterialView angularityData={materialState.angularityData} />}
        {materialState.viscosityRotationalData?.results && (
          <ViscosityRotationalMaterialView viscosityRotationalData={materialState.viscosityRotationalData} />
        )}
        {materialState.penetrationData?.results && <PenetrationMaterialView penetrationData={materialState.penetrationData} />}
        {materialState.softeningPointData?.results && <SofteningPointMaterialView softeningPointData={materialState.softeningPointData} />}
        {materialState.flashPointData?.results && <FlashPointMaterialView flashPointData={materialState.flashPointData} />}
        {materialState.ductilityData?.results && <DuctilityMaterialView ductilityData={materialState.ductilityData} />}
        {materialState.rtfoData?.results && <RtfoMaterialView rtfoData={materialState.rtfoData} />}
        {materialState.elasticRecoveryData?.results && (
          <ElasticRecoveryMaterialView elasticRecoveryData={materialState.elasticRecoveryData} />
        )}
      </Box>
    </BodyEssay>
  );
};

export default Material;