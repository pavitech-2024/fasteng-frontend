import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import ChapmanMaterialView from '@/components/concrete/material/chapmanMaterialView';
import CoarseAggregateSpecificMassMaterialView from '@/components/concrete/material/coarseAggregateMaterialView';
import GranulometryMateriaView from '@/components/concrete/material/concreteGranulometryMaterialView';
import SandIncreaseMaterialView from '@/components/concrete/material/sandIncreaseMaterialView';
import UnitMassMaterialView from '@/components/concrete/material/unitMassMaterialView';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { ConcreteMaterial } from '@/interfaces/concrete';
import concreteMaterialService from '@/services/concrete/concrete-materials.service';
import { ChapmanData } from '@/stores/concrete/chapman/chapman.store';
import { CoarseAggregateData } from '@/stores/concrete/coarseAggregate/coarseAggregate.store';
import { ConcreteGranulometryData } from '@/stores/concrete/granulometry/granulometry.store';
import { SandIncreaseData } from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { UnitMassData } from '@/stores/concrete/unitMass/unitMass.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import GeneratePDFConcreteMaterials from '@/components/generatePDF/materials/concrete/generetePDFConcrete/generatePDFConcreteMaterials';

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

export type EssaysData = {
  concreteGranulometryData: ConcreteGranulometryData;
  chapmanData: ChapmanData;
  unitMassData: UnitMassData;
  sandIncreaseData: SandIncreaseData;
  coarseAggregateSpecificMassRepositoryData: CoarseAggregateData;
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
  const [material, setMaterial] = useState<{ material: ConcreteMaterial; essays: IEssaysData[] }>();

  const [granulometryData, setGranulometryData] = useState<ConcreteGranulometryData>();
  const [specificMassData, setSpecificMassData] = useState<CoarseAggregateData>();
  const [unitMassData, setUnitMassData] = useState<UnitMassData>();
  const [sandIncreaseData, setSandIncreaseData] = useState<SandIncreaseData>();
  const [chapmanData, setChapmanData] = useState<ChapmanData>();
  const [type, setType] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await concreteMaterialService.getMaterial(id);
        setMaterial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load materials:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    // To-do: isolar essa função;
    const updateData = (essayName, materialType, setData) => {
      const essay = material?.essays.find((essay) => essay.essayName === essayName);
      if (essay && material?.material?.type === materialType) {
        setData(essay.data);
      }
    };

    updateData('granulometry', 'coarseAggregate', setGranulometryData);
    updateData('granulometry', 'fineAggregate', setGranulometryData);
    updateData('granulometry', 'cement', setGranulometryData);

    updateData('specificMass', 'coarseAggregate', setSpecificMassData);
    updateData('specificMass', 'fineAggregate', setSpecificMassData);
    updateData('specificMass', 'cement', setSpecificMassData);

    updateData('chapman', 'coarseAggregate', setChapmanData);
    updateData('chapman', 'fineAggregate', setChapmanData);
    updateData('chapman', 'cement', setChapmanData);

    updateData('unitMass', 'coarseAggregate', setUnitMassData);
    updateData('unitMass', 'fineAggregate', setUnitMassData);
    updateData('unitMass', 'cement', setUnitMassData);

    updateData('sandIncrease', 'coarseAggregate', setSandIncreaseData);
    updateData('sandIncrease', 'fineAggregate', setSandIncreaseData);
    updateData('sandIncrease', 'cement', setSandIncreaseData);
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
    if (material?.material.type === 'cement') {
      setType(t('materials.cement'));
    } else if (material?.material.type === 'coarseAggregate') {
      setType(t('materials.coarseAggregate'));
    } else if (material?.material.type === 'fineAggregate') {
      setType(t('materials.fineAggregate'));
    }
  }, [material]);

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
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('concrete.materials.name')}:</span>
                      <Typography>{material.material.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('concrete.materials.type')}:</span>
                      <Typography>{type}</Typography>
                    </Box>
                  </TextBox>
                  <GeneratePDFConcreteMaterials
                    name={material.material.name}
                    type={type}
                    granulometryData={granulometryData}
                    chapmanData={chapmanData}
                    sandIncreaseData={sandIncreaseData}
                    unitMassData={unitMassData}
                  />
                </Box>
              </FlexColumnBorder>

              {granulometryData?.results && <GranulometryMateriaView granulometryData={granulometryData} />}

              {/* {specificMassData?.result && <CoarseAggregateSpecificMassMaterialView specificMassData={specificMassData} />} */}

              {chapmanData?.results && <ChapmanMaterialView chapmanData={chapmanData} />}

              {sandIncreaseData?.results && <SandIncreaseMaterialView sandIncreaseData={sandIncreaseData} />}

              {unitMassData?.result && <UnitMassMaterialView unitMassData={unitMassData} />}
            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default Material;
