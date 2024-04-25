import GranulometryMateriaView from '@/components/asphalt/material/granulometryMaterialView';
import ShapeIndexMaterialView from '@/components/asphalt/material/shapeIndexMaterialView';
import SpecificMassMaterialView from '@/components/asphalt/material/specificMassMaterialView';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { ElongatedParticlesData } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import { AsphaltGranulometryData } from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { ShapeIndexData } from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { SpecifyMassData } from '@/stores/asphalt/specifyMass/specifyMass.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import ElongatedParticlesMaterialView from '@/components/asphalt/material/elongatedParticesMaterialView';
import { AdhesivenessData } from '@/stores/asphalt/adhesiveness/adhesiveness.store';
import AdhesivenessMaterialView from '@/components/asphalt/material/adhesivenessMaterialView';
import { AbrasionData } from '@/stores/asphalt/abrasion/abrasion.store';
import LosAngelesAbrasionMaterialView from '@/components/asphalt/material/abrasionMaterialView';
import { SandEquivalentData } from '@/stores/asphalt/sandEquivalent/sandEquivalent.store';
import SandEquivalentMaterialView from '@/components/asphalt/material/sandEquivalentMaterialView';
import { AngularityData } from '@/stores/asphalt/angularity/angularity.store';
import AngularityMaterialView from '@/components/asphalt/material/angularityMaterialView';
import { ViscosityRotationalData } from '@/stores/asphalt/viscosityRotational/viscosityRotational.store';
import ViscosityRotationalMaterialView from '@/components/asphalt/material/viscosityRotationalMaterialView';
import { PenetrationData } from '@/stores/asphalt/penetration/penetration.store';
import PenetrationMaterialView from '@/components/asphalt/material/penetrationMaterialView';
import { SofteningPointData } from '@/stores/asphalt/softeningPoint/softeningPoint.store';
import SofteningPointMaterialView from '@/components/asphalt/material/softeningPointMaterialView';
import { FlashPointData } from '@/stores/asphalt/flashPoint/flashPoint.store';
import FlashPointMaterialView from '@/components/asphalt/material/flashPointMaterialView';
import { DuctilityData } from '@/stores/asphalt/ductility/ductility.store';
import DuctilityMaterialView from '@/components/asphalt/material/ductilityMaterialView';
import { RtfoData } from '@/stores/asphalt/rtfo/rtfo.store';
import RtfoMaterialView from '@/components/asphalt/material/rtfoMaterialView';
import { ElasticRecoveryData } from '@/stores/asphalt/elasticRecovery/elasticRecovery.store';
import ElasticRecoveryMaterialView from '@/components/asphalt/material/elasticRecoveryMaterialView';

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

export type EssaysData = {
  asphaltGranulometryData: AsphaltGranulometryData;
  specifyMassData: SpecifyMassData;
  shapeIndexData: ShapeIndexData;
  elongatedParticlesData: ElongatedParticlesData;
  adhesivenessData: AdhesivenessData;
  losAngelesAbrasionData: AbrasionData;
  sandEquivalentData: SandEquivalentData;
  angularityData: AngularityData;
  viscosityRotationalData: ViscosityRotationalData;
  penetrationData: PenetrationData;
  softeningPointData: SofteningPointData
  flashPointData: FlashPointData;
  ductilityData: DuctilityData;
  rtfoData: RtfoData;
  elasticRecoveryData: ElasticRecoveryData
};
interface IEssaysData {
  essayName: string;
  data: EssaysData;
}

const Material = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id.toString();
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<{ material: AsphaltMaterial; essays: IEssaysData[] }>();

  const [granulometryData, setGranulometryData] = useState<AsphaltGranulometryData>();
  const [specificMassData, setSpecificMassData] = useState<SpecifyMassData>();
  const [shapeIndexData, setShapeIndexData] = useState<ShapeIndexData>();
  const [elongatedParticlesData, setElongatedParticlesData] = useState<ElongatedParticlesData>();
  const [adhesivenessData, setAdhesivenessData] = useState<AdhesivenessData>();
  const [losAngelesAbrasionData, setLosAngelesAbrasionData] = useState<AbrasionData>();
  const [sandEquivalentData, setSandEquivalentData] = useState<SandEquivalentData>();
  const [angularityData, setAngularityData] = useState<AngularityData>();
  const [viscosityRotationalData, setViscosityRotationalData] = useState<ViscosityRotationalData>();
  const [penetrationData, setPenetrationData] = useState<PenetrationData>();
  const [softeningPointData, setSofteningPointData] = useState<SofteningPointData>();
  const [flashPointData, setFlashPointData] = useState<FlashPointData>();
  const [ductilityData, setDuctilityData] = useState<DuctilityData>();
  const [rtfoData, setRtfoData] = useState<RtfoData>();
  const [elasticRecoveryData, setElasticRecoveryData] = useState<ElasticRecoveryData>();
  const [type, setType] = useState('');


  // To-do: remover material hardcoded;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await materialsService.getMaterial(id);
        setMaterial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const updateData = (essayName, materialType, setData) => {
      const essay = material?.essays.find((essay) => essay.essayName === essayName);
      if (essay && material?.material?.type === materialType) {
        setData(essay.data);
      }
    };
  
    updateData('granulometry', 'coarseAggregate', setGranulometryData);
    updateData('specificMass', 'coarseAggregate', setSpecificMassData);
    updateData('shapeIndex', 'coarseAggregate', setShapeIndexData);
    updateData('elongatedParticles', 'coarseAggregate', setElongatedParticlesData);
    updateData('adhesiveness', 'coarseAggregate', setAdhesivenessData);
    updateData('losAngelesAbrasion', 'coarseAggregate', setLosAngelesAbrasionData);
    updateData('granulometry', 'fineAggregate', setGranulometryData);
    updateData('specificMass', 'fineAggregate', setSpecificMassData);
    updateData('sandEquivalent', 'fineAggregate', setSandEquivalentData);
    updateData('angularity', 'fineAggregate', setAngularityData);
    updateData('granulometry', 'filler', setGranulometryData);
    updateData('specificMass', 'filler', setSpecificMassData);
    updateData('sandEquivalent', 'filler', setSandEquivalentData);
    updateData('viscosityRotational', 'asphaltBinder', setViscosityRotationalData);
    updateData('penetration', 'asphaltBinder', setPenetrationData);
    updateData('softeningPoint', 'asphaltBinder', setSofteningPointData);
    updateData('flashPoint', 'asphaltBinder', setFlashPointData);
    updateData('ductility', 'asphaltBinder', setDuctilityData);
    updateData('rtfo', 'asphaltBinder', setRtfoData);
    updateData('viscosityRotational', 'CAP', setViscosityRotationalData);
    updateData('penetration', 'CAP', setPenetrationData);
    updateData('softeningPoint', 'CAP', setSofteningPointData);
    updateData('flashPoint', 'CAP', setFlashPointData);
    updateData('ductility', 'CAP', setDuctilityData);
    updateData('elasticRecovery', 'CAP', setElasticRecoveryData);
    updateData('rtfo', 'CAP', setRtfoData);
  }, [material]);

  const TextBox = ({ children }: TextBoxProps) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'no-wrap',
        fontSize: { mobile: '.85rem', notebook: '1rem' },
        color: 'primaryTons.mainGray',
      }}
    >
      {children}
    </Box>
  );

  useEffect(() => {
    if (material?.material.type === 'CAP') {
      setType(t('asphalt.materials.cap'))
    } else if (material?.material.type === 'asphaltBinder') {
      setType(t('asphalt.materials.asphaltBinder'))
    } else if (material?.material.type === 'coarseAggregate') {
      setType(t('asphalt.materials.coarseAggregate'))
    } else if (material?.material.type === 'filler') {
      setType(t('asphalt.materials.filler'))
    } else if (material?.material.type === 'fineAggregate') {
      setType(t('asphalt.materials.fineAggregate'))
    } else if (material?.material.type === 'other') {
      setType(t('asphalt.materials.other'))
    }
  },[material])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BodyEssay>
            <Box
              sx={{
                width: { mobile: '90%', notebook: '80%' },
                maxWidth: '2200px',
                padding: '2rem',
                borderRadius: '20px',
                bgcolor: 'primaryTons.white',
                border: '1px solid',
                borderColor: 'primaryTons.border',
                marginTop: '5rem',
              }}
            >
              <FlexColumnBorder title={t('general data of essay')} open={true}>
                <Box
                  sx={{
                    display: 'flex',
                    padding: { mobile: '10px', notebook: '25px' },
                    mb: { mobile: '-55px', notebook: '-80px' },
                    transform: { mobile: 'translateY(-70px)', notebook: 'translateY(-60px)' },
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <TextBox>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('asphalt.materials.name')}:</span>
                      <Typography>{material.material.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('asphalt.materials.type')}:</span>
                      <Typography>{type}</Typography>
                    </Box>
                  </TextBox>
                </Box>
              </FlexColumnBorder>

              {granulometryData?.results && <GranulometryMateriaView granulometryData={granulometryData} />}

              {specificMassData?.results && <SpecificMassMaterialView specificMassData={specificMassData} />}

              {shapeIndexData?.results && <ShapeIndexMaterialView shapeIndexData={shapeIndexData} />}

              {elongatedParticlesData?.results && (
                <ElongatedParticlesMaterialView elongatedParticlesData={elongatedParticlesData} />
              )}

              {adhesivenessData?.results && <AdhesivenessMaterialView adhesivenessData={adhesivenessData} />}

              {losAngelesAbrasionData?.results && (
                <LosAngelesAbrasionMaterialView losAngelesAbrasionData={losAngelesAbrasionData} />
              )}

              {sandEquivalentData?.results && <SandEquivalentMaterialView sandEquivalentData={sandEquivalentData} />}

              {angularityData?.results && <AngularityMaterialView angularityData={angularityData} />}

              {viscosityRotationalData?.results && <ViscosityRotationalMaterialView viscosityRotationalData={viscosityRotationalData} />}

              {penetrationData?.results && <PenetrationMaterialView penetrationData={penetrationData} />}

              {softeningPointData?.results && <SofteningPointMaterialView softeningPointData={softeningPointData} />}

              {flashPointData?.results && <FlashPointMaterialView flashPointData={flashPointData} />}

              {ductilityData?.results && <DuctilityMaterialView ductilityData={ductilityData} />}

              {rtfoData?.results && <RtfoMaterialView rtfoData={rtfoData} />}

              {elasticRecoveryData?.results && <ElasticRecoveryMaterialView elasticRecoveryData={elasticRecoveryData} />}

            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default Material;