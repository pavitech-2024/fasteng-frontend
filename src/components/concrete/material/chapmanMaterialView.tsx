import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import useAuth from '@/contexts/auth';
import { EssaysData } from '@/pages/concrete/materials/material/[id]';
import { Box } from '@mui/material';
import { t } from 'i18next';

export interface IChapmanMaterialView {
  chapmanData: EssaysData['chapmanData'];
}

const ChapmanMaterialView = ({ chapmanData }: IChapmanMaterialView) => {

  const { user } = useAuth();

  const {
    preferences: { decimal: user_decimal },
  } = user;

  return (
    <FlexColumnBorder title={t('concrete.essays.coarseAggregate')} open={true}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr' },
          gap: '10px',
          mt: '20px',
        }}
      >
        <FlexColumnBorder title={t('results')} open={true}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Result_Card label={'M.E'} value={chapmanData.results.m_e.toFixed(user_decimal)} unity={'kg/L'} />
          </Box>
        </FlexColumnBorder>
      </Box>
    </FlexColumnBorder>
  );
};

export default ChapmanMaterialView;
