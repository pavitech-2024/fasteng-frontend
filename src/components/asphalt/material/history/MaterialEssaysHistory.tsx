// components/organisms/material-essays-history/MaterialEssaysHistory.tsx
import { useState } from 'react';
import { Box, Button, Typography, Pagination, Stack } from '@mui/material';
import { GranulometryEssay } from '../types/material.types';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { MaterialEssayModal } from '../MaterialEssayModal';

interface MaterialEssaysHistoryProps {
  granulometryEssays: GranulometryEssay[];
}

// Função auxiliar para normalizar o ensaio
const normalizeEssay = (essay: any): GranulometryEssay => {
  // Se o ensaio já tem a estrutura com essayName e data
  if (essay.essayName && essay.data) {
    return essay.data;
  }
  // Se o ensaio é o objeto direto
  return essay;
};

export const MaterialEssaysHistory = ({ granulometryEssays }: MaterialEssaysHistoryProps) => {
  const [showGranulometryHistory, setShowGranulometryHistory] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<GranulometryEssay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Normalizar todos os ensaios antes de usar
  const normalizedEssays = granulometryEssays.map(normalizeEssay).filter(essay => essay?.generalData);
  
  // Configuração da paginação
  const essaysPerPage = 4;
  const totalPages = Math.ceil(normalizedEssays.length / essaysPerPage);
  
  // Calcular ensaios da página atual
  const startIndex = (currentPage - 1) * essaysPerPage;
  const endIndex = startIndex + essaysPerPage;
  const currentEssays = normalizedEssays.slice(startIndex, endIndex);

  const openEssayModal = (essay: GranulometryEssay) => {
    setSelectedEssay(essay);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEssay(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  if (normalizedEssays.length === 0) return null;

  return (
    <>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setShowGranulometryHistory(!showGranulometryHistory);
            setCurrentPage(1);
          }}
          sx={{ mb: 2 }}
        >
          {showGranulometryHistory ? 'Ocultar' : 'Mostrar'} Histórico de Ensaios  (
          {normalizedEssays.length})
        </Button>

        {showGranulometryHistory && (
          <FlexColumnBorder title="Histórico de Ensaios" open={true}>
            {/* Lista de ensaios paginados */}
            {currentEssays.map((essay) => (
              <Box key={essay._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">
                      {essay.generalData?.name || 'Ensaio sem nome'}
                    </Typography>
                    <Typography variant="body2">
                      Data: {essay.generalData?.createdAt 
                        ? new Date(essay.generalData.createdAt).toLocaleDateString() 
                        : 'Data não disponível'} 
                      {essay.generalData?.operator && ` | Operador: ${essay.generalData.operator}`}
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small" onClick={() => openEssayModal(essay)}>
                    Ver Ensaio Completo
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mt: 1 }}>
                  {essay.results && (
                    <>
                      {essay.results.fineness_module !== undefined && (
                        <Result_Card label="M. Finura" value={`${essay.results.fineness_module}`} unity="%" />
                      )}
                      {essay.results.nominal_size !== undefined && (
                        <Result_Card label="Tam. Nominal" value={`${essay.results.nominal_size}`} unity="mm" />
                      )}
                      {essay.results.cc !== undefined && (
                        <Result_Card label="CC" value={`${essay.results.cc}`} unity="" />
                      )}
                      {essay.results.cnu !== undefined && (
                        <Result_Card label="CNU" value={`${essay.results.cnu}`} unity="" />
                      )}
                      {essay.results.error !== undefined && (
                        <Result_Card label="Erro" value={`${essay.results.error}`} unity="%" />
                      )}
                    </>
                  )}
                </Box>
              </Box>
            ))}

            {/* Paginação */}
            {totalPages > 1 && (
              <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                />
                <Typography variant="body2" color="text.secondary">
                  Página {currentPage} de {totalPages} - Mostrando {currentEssays.length} de {normalizedEssays.length} ensaios
                </Typography>
              </Stack>
            )}
          </FlexColumnBorder>
        )}
      </Box>

      {selectedEssay && (
        <MaterialEssayModal essay={selectedEssay} open={modalOpen} onClose={closeModal} />
      )}
    </>
  );
};