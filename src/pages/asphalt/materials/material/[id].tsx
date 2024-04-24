import ElongatedParticles_results_Dimensions_Table from '@/components/asphalt/essays/elongatedParticles/tables/results-dimensions-table.elongatedParticles';
import AsphaltGranulometry_resultsTable from '@/components/asphalt/essays/granulometry/tables/results-table.granulometry';
import GranulometryMateriaView from '@/components/asphalt/material/granulometryMaterialView';
import ShapeIndexMaterialView from '@/components/asphalt/material/shapeIndexMaterialView';
import SpecificMassMaterialView from '@/components/asphalt/material/specificMassMaterialView';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { ElongatedParticlesData } from '@/stores/asphalt/elongatedParticles/elongatedParticles.store';
import { AsphaltGranulometryData } from '@/stores/asphalt/granulometry/asphalt-granulometry.store';
import { ShapeIndexData } from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { SpecifyMassData } from '@/stores/asphalt/specifyMass/specifyMass.store';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import ElongatedParticles from '../../essays/elongatedParticles';
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
  ductilityData: DuctilityData
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
  console.log('🚀 ~ Material ~ material:', material);

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

  // COARSE AGGREGATE

  useEffect(() => {
    if (
      material?.essays.some((essay) => essay.essayName === 'granulometry') &&
      material?.material?.type === 'coarseAggregate'
    ) {
      setGranulometryData(
        material.essays.find((essay) => essay.essayName === 'granulometry')
          .data as unknown as EssaysData['asphaltGranulometryData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'specificMass') &&
      material?.material?.type === 'coarseAggregate'
    ) {
      setSpecificMassData(
        material.essays.find((essay) => essay.essayName === 'specificMass')
          .data as unknown as EssaysData['specifyMassData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'shapeIndex') &&
      material?.material?.type === 'coarseAggregate'
    ) {
      setShapeIndexData(
        material.essays.find((essay) => essay.essayName === 'shapeIndex')
          .data as unknown as EssaysData['shapeIndexData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'elongatedParticles') &&
      material?.material?.type === 'coarseAggregate'
    ) {
      setElongatedParticlesData(
        material.essays.find((essay) => essay.essayName === 'elongatedParticles')
          .data as unknown as EssaysData['elongatedParticlesData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'adhesiveness') &&
      material?.material?.type === 'coarseAggregate'
    ) {
      setAdhesivenessData(
        material.essays.find((essay) => essay.essayName === 'adhesiveness')
          .data as unknown as EssaysData['adhesivenessData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'losAngelesAbrasion') &&
      material?.material?.type === 'coarseAggregate'
    ) {
      setLosAngelesAbrasionData(
        material.essays.find((essay) => essay.essayName === 'losAngelesAbrasion')
          .data as unknown as EssaysData['losAngelesAbrasionData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'granulometry') &&
      material?.material?.type === 'fineAggregate'
    ) {
      setGranulometryData(
        material.essays.find((essay) => essay.essayName === 'granulometry')
          .data as unknown as EssaysData['asphaltGranulometryData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'specificMass') &&
      material?.material?.type === 'fineAggregate'
    ) {
      setSpecificMassData(
        material.essays.find((essay) => essay.essayName === 'specificMass')
          .data as unknown as EssaysData['specifyMassData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'sandEquivalent') &&
      material?.material?.type === 'fineAggregate'
    ) {
      setSandEquivalentData(
        material.essays.find((essay) => essay.essayName === 'sandEquivalent')
          .data as unknown as EssaysData['sandEquivalentData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'angularity') &&
      material?.material?.type === 'fineAggregate'
    ) {
      setAngularityData(
        material.essays.find((essay) => essay.essayName === 'angularity')
          .data as unknown as EssaysData['angularityData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'granulometry') &&
      material?.material?.type === 'filler'
    ) {
      setGranulometryData(
        material.essays.find((essay) => essay.essayName === 'granulometry')
          .data as unknown as EssaysData['asphaltGranulometryData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'specificMass') &&
      material?.material?.type === 'filler'
    ) {
      setSpecificMassData(
        material.essays.find((essay) => essay.essayName === 'specificMass')
          .data as unknown as EssaysData['specifyMassData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'sandEquivalent') &&
      material?.material?.type === 'filler'
    ) {
      setSandEquivalentData(
        material.essays.find((essay) => essay.essayName === 'sandEquivalent')
          .data as unknown as EssaysData['sandEquivalentData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'viscosityRotational') &&
      material?.material?.type === 'asphaltBinder'
    ) {
      setViscosityRotationalData(
        material.essays.find((essay) => essay.essayName === 'viscosityRotational')
          .data as unknown as EssaysData['viscosityRotationalData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'penetration') &&
      material?.material?.type === 'asphaltBinder'
    ) {
      setPenetrationData(
        material.essays.find((essay) => essay.essayName === 'penetration')
          .data as unknown as EssaysData['penetrationData']
      );
    }
    
    if (
      material?.essays.some((essay) => essay.essayName === 'softeningPoint') &&
      material?.material?.type === 'asphaltBinder'
    ) {
      setSofteningPointData(
        material.essays.find((essay) => essay.essayName === 'softeningPoint')
          .data as unknown as EssaysData['softeningPointData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'flashPoint') &&
      material?.material?.type === 'asphaltBinder'
    ) {
      setFlashPointData(
        material.essays.find((essay) => essay.essayName === 'flashPoint')
          .data as unknown as EssaysData['flashPointData']
      );
    }

    if (
      material?.essays.some((essay) => essay.essayName === 'ductility') &&
      material?.material?.type === 'asphaltBinder'
    ) {
      setDuctilityData(
        material.essays.find((essay) => essay.essayName === 'ductility')
          .data as unknown as EssaysData['ductilityData']
      );
    }
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
                    mb: { mobile: '-55px', notebook: '-45px' },
                    transform: { mobile: 'translateY(-70px)', notebook: 'translateY(-60px)' },
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <TextBox>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('asphalt.matyerial.name')}:</span>
                      <Typography>{material.material.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('asphalt.matyerial.type')}:</span>
                      <Typography>{material.material.type}</Typography>
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

            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default Material;
