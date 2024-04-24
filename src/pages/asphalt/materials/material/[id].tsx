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

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

export type EssaysData = {
  asphaltGranulometryData: AsphaltGranulometryData;
  specifyMassData: SpecifyMassData;
  shapeIndexData: ShapeIndexData;
  elongatedParticlesData: ElongatedParticlesData;
  adhesivenessData: AdhesivenessData;
  losAngelesAbrasionData: AbrasionData
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
    if (material?.essays.some((essay) => essay.essayName === 'granulometry') 
      && material?.material?.type === 'coarseAggregate') {
        setGranulometryData(material.essays.find((essay) => essay.essayName === 'granulometry')
        .data as unknown as EssaysData['asphaltGranulometryData'])
    }

    if (material?.essays.some(
      (essay) => essay.essayName === 'granulometry'
    ) && material?.material?.type === 'fineAggregate') {
      setGranulometryData(material.essays.find((essay) => essay.essayName === 'granulometry')
      .data as unknown as EssaysData['asphaltGranulometryData'])
    }
  }, [material])

  // const granulometryData: EssaysData['asphaltGranulometryData'] = material?.essays.some(
  //   (essay) => essay.essayName === 'granulometry'
  // ) && material?.material?.type === 'coarseAggregate'
  //   ? (material.essays.find((essay) => essay.essayName === 'granulometry')
  //       .data as unknown as EssaysData['asphaltGranulometryData'])
  //   : undefined;

  const specificMassData: SpecifyMassData = material?.essays.some((essay) => essay.essayName === 'specificMass')
    ? (material.essays.find((essay) => essay.essayName === 'specificMass')
        .data as unknown as EssaysData['specifyMassData'])
    : undefined;

  const shapeIndexData: ShapeIndexData = material?.essays.some((essay) => essay.essayName === 'shapeIndex')
    ? (material.essays.find((essay) => essay.essayName === 'shapeIndex')
        .data as unknown as EssaysData['shapeIndexData'])
    : undefined;

  const elongatedParticlesData: ElongatedParticlesData = material?.essays.some(
    (essay) => essay.essayName === 'elongatedParticles'
  )
    ? (material.essays.find((essay) => essay.essayName === 'elongatedParticles')
        .data as unknown as EssaysData['elongatedParticlesData'])
    : undefined;

  const adhesivenessData: AdhesivenessData = material?.essays.some((essay) => essay.essayName === 'adhesiveness')
    ? (material.essays.find((essay) => essay.essayName === 'adhesiveness')
        .data as unknown as EssaysData['adhesivenessData'])
    : undefined;

  const losAngelesAbrasionData: AbrasionData = material?.essays.some((essay) => essay.essayName === 'losAngelesAbrasion')
    ? (material.essays.find((essay) => essay.essayName === 'losAngelesAbrasion')
        .data as unknown as EssaysData['losAngelesAbrasionData'])
    : undefined;


  // FINE AGGREGATE
  // const fineAggregateGranulometryData: EssaysData['asphaltGranulometryData'] = material?.essays.some(
  //   (essay) => essay.essayName === 'granulometry'
  // ) && material?.material?.type === 'fineAggregate'
  //   ? (material.essays.find((essay) => essay.essayName === 'granulometry')
  //       .data as unknown as EssaysData['asphaltGranulometryData'])
  //   : undefined;
  
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
            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default Material;
