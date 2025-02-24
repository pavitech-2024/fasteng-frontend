import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Loading from '@/components/molecules/loading';
import BodyEssay from '@/components/organisms/bodyEssay';
import CbrSampleView from '@/components/soils/samples/cbrSampleView';
import CompressionSampleView from '@/components/soils/samples/compressionSampleView';
import HrbSampleView from '@/components/soils/samples/hrbSampleView';
import GranulometrySampleView from '@/components/soils/samples/soilsGranulometryMaterialView';
import SucsSampleView from '@/components/soils/samples/sucsSampleView';
import { SampleData, SampleTypes } from '@/interfaces/soils';
import samplesService from '@/services/soils/soils-samples.service';
import { CbrData } from '@/stores/soils/cbr/cbr.store';
import { CompressionData } from '@/stores/soils/compression/compression.store';
import { SoilsGranulometryData } from '@/stores/soils/granulometry/granulometry.store';
import { HrbData } from '@/stores/soils/hrb/hrb.store';
import { SucsData } from '@/stores/soils/sucs/sucs.store';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';

interface TextBoxProps {
  children: JSX.Element | ReactNode;
}

export type EssaysData = {
  saoilGranulometryData: SoilsGranulometryData;
  cbrData: CbrData;
  hrbData: HrbData;
  sucsData: SucsData;
  compressionData: CompressionData;
};
interface IEssaysData {
  essayName: string;
  data: EssaysData;
}

const SoilSample = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id.toString();
  const [loading, setLoading] = useState(true);
  const [sample, setSample] = useState<{ sample: SampleData; essays: IEssaysData[] }>();

  const [granulometryData, setGranulometryData] = useState<SoilsGranulometryData>();
  const [compressionData, setCompressionData] = useState<CompressionData>();
  const [hrbData, setHrbData] = useState<HrbData>();
  const [sucsData, setSucsData] = useState<SucsData>();
  const [cbrData, setCbrData] = useState<CbrData>();

  const [type, setType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await samplesService.getSample(id);
        setSample(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    // To-do: isolar essa função;
    const updateData = (essayName, sampleType, setData) => {
      const essay = sample?.essays.find((essay) => essay.essayName === essayName);
      if (essay && sample?.sample?.type === sampleType) {
        setData(essay.data);
      }
    };

    updateData('granulometry', 'inorganicSoil', setGranulometryData);
    updateData('granulometry', 'organicSoil', setGranulometryData);
    updateData('granulometry', 'pavimentLayer', setGranulometryData);

    updateData('compression', 'inorganicSoil', setCompressionData);
    updateData('compression', 'organicSoil', setCompressionData);
    updateData('compression', 'pavimentLayer', setCompressionData);

    updateData('cbr', 'inorganicSoil', setCbrData);
    updateData('cbr', 'organicSoil', setCbrData);
    updateData('cbr', 'pavimentLayer', setCbrData);

    updateData('hrb', 'inorganicSoil', setHrbData);
    updateData('hrb', 'organicSoil', setHrbData);
    updateData('hrb', 'pavimentLayer', setHrbData);

    updateData('sucs', 'inorganicSoil', setSucsData);
    updateData('sucs', 'organicSoil', setSucsData);
    updateData('sucs', 'pavimentLayer', setSucsData);
  }, [sample]);

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
    if (sample?.sample.type === 'inorganicSoil') {
      setType(t('samples.inorganicSoil'));
    } else if (sample?.sample.type === 'organicSoil') {
      setType(t('samples.organicSoil'));
    } else if (sample?.sample.type === 'pavementLayer') {
      setType(t('samples.pavementLayer'));
    }
  }, [sample]);

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
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('samples.name')}:</span>
                      <Typography>{sample.sample.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <span style={{ fontWeight: '700', marginRight: '5px' }}>{t('samples.type')}:</span>
                      <Typography>{type}</Typography>
                    </Box>
                  </TextBox>
                </Box>
              </FlexColumnBorder>

              {granulometryData?.results && <GranulometrySampleView granulometryData={granulometryData} />}

              {compressionData?.results && <CompressionSampleView compressionData={compressionData} />}

              {cbrData?.results && <CbrSampleView cbrData={cbrData} />}

              {sucsData?.results && <SucsSampleView sucsData={sucsData} />}

              {hrbData?.results && <HrbSampleView hrbData={hrbData} />}
            </Box>
          </BodyEssay>
        </>
      )}
    </>
  );
};

export default SoilSample;
