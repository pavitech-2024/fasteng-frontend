// components/organisms/material-essays-history/MaterialEssaysHistory.tsx
import { useState } from 'react';
import { Box, Button, Typography, Pagination, Stack, Chip, Tooltip, Divider, useTheme } from '@mui/material';
import { GranulometryEssay } from '../types/material.types';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import Result_Card from '@/components/atoms/containers/result-card';
import { MaterialEssayModal } from '../MaterialEssayModal';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

interface MaterialEssaysHistoryProps {
  granulometryEssays: GranulometryEssay[];
}

const normalizeEssay = (essay: any): GranulometryEssay => {
  if (essay.essayName && essay.data) {
    return essay.data;
  }
  return essay;
};

export const MaterialEssaysHistory = ({ granulometryEssays }: MaterialEssaysHistoryProps) => {
  const theme = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<GranulometryEssay | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedEssays = granulometryEssays.map(normalizeEssay).filter((essay) => essay?.generalData);

  const essaysPerPage = 4;
  const totalPages = Math.ceil(normalizedEssays.length / essaysPerPage);

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (normalizedEssays.length === 0) return null;

  return (
    <>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setShowHistory(!showHistory);
            setCurrentPage(1);
          }}
          startIcon={<HistoryOutlinedIcon />}
          sx={{
            mb: 2,
            px: 2.5,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          {showHistory ? 'Ocultar Histórico' : 'Histórico de Ensaios'}
          <Chip
            label={normalizedEssays.length}
            size="small"
            sx={{
              ml: 1.5,
              bgcolor: 'action.selected',
              fontWeight: 600,
            }}
          />
        </Button>

        {showHistory && (
          <FlexColumnBorder title="Histórico de Ensaios" open={true}>
            {currentEssays.map((essay) => (
              <Box
                key={essay._id}
                sx={{
                  mb: 2,
                  p: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px',
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: 'grey.400',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {essay.generalData?.name || 'Ensaio sem nome'}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        color: 'text.secondary',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />
                        <Typography variant="body2">{formatDate(essay.generalData?.createdAt)}</Typography>
                      </Box>

                      {essay.generalData?.operator && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonOutlinedIcon sx={{ fontSize: 15 }} />
                          <Typography variant="body2">{essay.generalData.operator}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openEssayModal(essay)}
                    startIcon={<VisibilityOutlinedIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 2,
                      borderRadius: '6px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </Box>

                {essay.results && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
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
                      {(essay.results as any)?.data?.softeningPoint !== undefined && (
                        <Result_Card
                          label="Ponto de Amolecimento"
                          value={`${(essay.results as any).data.softeningPoint}`}
                          unity="°C"
                        />
                      )}
                      {(essay.results as any)?.data?.penetration !== undefined && (
                        <Result_Card
                          label="Penetração"
                          value={`${(essay.results as any).data.penetration}`}
                          unity="0.1mm"
                        />
                      )}
                      {(essay.results as any)?.data?.temperature !== undefined && (
                        <Result_Card
                          label="Temperatura"
                          value={`${(essay.results as any).data.temperature}`}
                          unity="°C"
                        />
                      )}
                      {(essay.results as any)?.data?.ductility !== undefined && (
                        <Result_Card
                          label="Ductilidade"
                          value={`${(essay.results as any).data.ductility}`}
                          unity="mm"
                        />
                      )}
                    </Box>
                  </>
                )}
              </Box>
            ))}

            {totalPages > 1 && (
              <Stack spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                />
                <Typography variant="body2" color="text.secondary">
                  {currentEssays.length} de {normalizedEssays.length} ensaios
                </Typography>
              </Stack>
            )}
          </FlexColumnBorder>
        )}
      </Box>

      {selectedEssay && <MaterialEssayModal essay={selectedEssay} open={modalOpen} onClose={closeModal} />}
    </>
  );
};
