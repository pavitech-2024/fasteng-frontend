import { MaterialsIcon } from '@/assets';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import ExperimentResume, { ExperimentResumeData } from '@/components/molecules/boxes/experiment-resume';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import EssayTemplate from '@/components/templates/essay';
import MaterialTemplate from '@/components/templates/material';
import MaterialsTemplate from '@/components/templates/materials';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

const Material = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id.toString();
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<AsphaltMaterial>();
  console.log('🚀 ~ Material ~ material:', material);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await materialsService.getMaterial('650de742205bb691362b7e7c');
        setMaterial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
      }
    };

    fetchData();
  }, [id]);

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
      {material === undefined ? (
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
                    <Box sx={{ display: 'flex'}}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>
                        {t('asphalt.matyerial.name')}:
                      </span>
                      <Typography>{material.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex'}}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>
                        {t('asphalt.matyerial.type')}:
                      </span>
                      <Typography>{material.type}</Typography>
                    </Box>
                  </TextBox>
                </Box>
              </FlexColumnBorder>


            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default Material;
