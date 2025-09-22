// components/organisms/essays-history/EssaysHistory.tsx
import { Box, Pagination, Typography, Button } from '@mui/material';
import { GranulometryEssay } from '../types/asphalt-granulometry.types';
import Result_Card from '@/components/atoms/containers/result-card';
import Loading from '@/components/molecules/loading';
import { t } from 'i18next';

interface EssaysHistoryProps {
  essays: GranulometryEssay[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEssayClick: (essay: GranulometryEssay) => void;
}

export const EssaysHistory = ({
  essays,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onEssayClick,
}: EssaysHistoryProps) => {
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {essays.map((essay) => (
        <Box key={essay._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{essay.generalData.name}</Typography>
              <Typography variant="body2">
                Material: {essay.generalData.material.name} | 
                Data: {new Date(essay.generalData.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              onClick={() => onEssayClick(essay)}
            >
              Ver Ensaio Completo
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mt: 1 }}>
            <Result_Card label="M. Finura" value={essay.results.fineness_module} unity="%" />
            <Result_Card label="Tam. Nominal" value={essay.results.nominal_size} unity="mm" />
            <Result_Card label="CC" value={essay.results.cc} unity="" />
            <Result_Card label="CNU" value={essay.results.cnu} unity="" />
            <Result_Card label="Erro" value={essay.results.error} unity="%" />
          </Box>
        </Box>
      ))}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary" 
          />
        </Box>
      )}
    </>
  );
};