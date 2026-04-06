import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Button, IconButton, Card, CardContent, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import useStabilizedLayersStore from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { useState, useEffect } from 'react';

// Definição do tipo para cada card (camada)
interface LayerCard {
  id: string;
  title: string; // Título livre, digitado pelo usuário
  grupoMCT: string;
  coeficienteC: string;
  indiceE: string;
  massaEspecifica: string;
  umidadeOtima: string;
  energiaCompactacao: string;
  moduloResiliencia: string;
  coeficienteK1: string;
  coeficienteK2: string;
  coeficienteK3: string;
  coeficienteK4: string;
  deformacaoPermanente: string;
  coeficienteK1Psi: string;
  coeficienteK2Psi: string;
  coeficienteK3Psi: string;
  coeficienteK4Psi: string;
}

// Todos os campos de parâmetros (conforme solicitado)
const layerFields = [
  { key: 'grupoMCT', label: 'Grupo MCT', required: false },
  { key: 'coeficienteC', label: 'MCT - Coeficiente c\' *', required: false },
  { key: 'indiceE', label: 'MCT - Índice e\' *', required: false },
  { key: 'massaEspecifica', label: 'Massa Específica (g/cm³) *', required: false },
  { key: 'umidadeOtima', label: 'Umidade Ótima (%) *', required: false },
  { key: 'energiaCompactacao', label: 'Energia de Compactação *', required: false },
  { key: 'moduloResiliencia', label: 'Módulo de Resiliência (MPa)', required: false },
  { key: 'coeficienteK1', label: 'Coeficiente de Regressão (k1) *', required: false },
  { key: 'coeficienteK2', label: 'Coeficiente de Regressão (k2) *', required: false },
  { key: 'coeficienteK3', label: 'Coeficiente de Regressão (k3) *', required: false },
  { key: 'coeficienteK4', label: 'Coeficiente de Regressão (k4) *', required: false },
  { key: 'deformacaoPermanente', label: 'Deformação Permanente', required: false },
  { key: 'coeficienteK1Psi', label: 'Coeficiente de Regressão (k1 ou psi) *', required: false },
  { key: 'coeficienteK2Psi', label: 'Coeficiente de Regressão (k2 ou psi) *', required: false },
  { key: 'coeficienteK3Psi', label: 'Coeficiente de Regressão (k3 ou psi) *', required: false },
  { key: 'coeficienteK4Psi', label: 'Coeficiente de Regressão (k4 ou psi) *', required: false },
];

const StabilizedLayers_step3 = ({ setNextDisabled }: EssayPageProps) => {
  const { step3Data, setData } = useStabilizedLayersStore();

  // Inicializa os cards: se houver dados salvos, usa-os; senão, cria um card com título vazio
  const [cards, setCards] = useState<LayerCard[]>(() => {
    if (step3Data.layers && Array.isArray(step3Data.layers) && step3Data.layers.length > 0) {
      return step3Data.layers;
    }
    return [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: '', // ← NENHUM TÍTULO FIXO, usuário digita
        grupoMCT: '',
        coeficienteC: '',
        indiceE: '',
        massaEspecifica: '',
        umidadeOtima: '',
        energiaCompactacao: '',
        moduloResiliencia: '',
        coeficienteK1: '',
        coeficienteK2: '',
        coeficienteK3: '',
        coeficienteK4: '',
        deformacaoPermanente: '',
        coeficienteK1Psi: '',
        coeficienteK2Psi: '',
        coeficienteK3Psi: '',
        coeficienteK4Psi: '',
      },
    ];
  });

  // Salva os cards no store sempre que houver alteração e habilita o botão "Próximo"
  useEffect(() => {
    setData({ step: 2, key: 'layers', value: cards });
    setNextDisabled(false); // sem validação obrigatória
  }, [cards, setData, setNextDisabled]);

  // Adiciona um novo card com todos os campos vazios
  const addCard = () => {
    const newCard: LayerCard = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: '',
      grupoMCT: '',
      coeficienteC: '',
      indiceE: '',
      massaEspecifica: '',
      umidadeOtima: '',
      energiaCompactacao: '',
      moduloResiliencia: '',
      coeficienteK1: '',
      coeficienteK2: '',
      coeficienteK3: '',
      coeficienteK4: '',
      deformacaoPermanente: '',
      coeficienteK1Psi: '',
      coeficienteK2Psi: '',
      coeficienteK3Psi: '',
      coeficienteK4Psi: '',
    };
    setCards(prev => [...prev, newCard]);
  };

  // Remove um card (se for o último, apenas limpa os campos)
  const removeCard = (id: string) => {
    if (cards.length === 1) {
      setCards(prev =>
        prev.map(card =>
          card.id === id
            ? {
                ...card,
                title: '',
                grupoMCT: '',
                coeficienteC: '',
                indiceE: '',
                massaEspecifica: '',
                umidadeOtima: '',
                energiaCompactacao: '',
                moduloResiliencia: '',
                coeficienteK1: '',
                coeficienteK2: '',
                coeficienteK3: '',
                coeficienteK4: '',
                deformacaoPermanente: '',
                coeficienteK1Psi: '',
                coeficienteK2Psi: '',
                coeficienteK3Psi: '',
                coeficienteK4Psi: '',
              }
            : card
        )
      );
    } else {
      setCards(prev => prev.filter(card => card.id !== id));
    }
  };

  // Atualiza um campo específico de um card
  const updateCardField = (id: string, field: keyof LayerCard, value: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  return (
    <FlexColumnBorder
      title="CAMADAS ESTABILIZADAS – PARÂMETROS DO MATERIAL"
      open={true}
      theme={'#07B811'}
      sx_title={{ whiteSpace: 'wrap', fontWeight: 'bold' }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {cards.map((card) => (
          <Card key={card.id} variant="outlined" sx={{ p: 2, position: 'relative' }}>
            <IconButton
              aria-label="remover"
              onClick={() => removeCard(card.id)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <DeleteIcon />
            </IconButton>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Nome da Camada / Material
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Ex: Subleito, Aterro, Base Granular, etc."
                value={card.title}
                onChange={(e) => updateCardField(card.id, 'title', e.target.value)}
                sx={{ mb: 3 }}
              />
              <Grid container spacing={2}>
                {layerFields.map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field.key}>
                    <TextField
                      fullWidth
                      variant="standard"
                      label={field.label}
                      value={card[field.key as keyof LayerCard] || ''}
                      onChange={(e) =>
                        updateCardField(card.id, field.key as keyof LayerCard, e.target.value)
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCard}
          sx={{ alignSelf: 'flex-start', mt: 1 }}
        >
          Adicionar camada / material
        </Button>
      </Box>
    </FlexColumnBorder>
  );
};

export default StabilizedLayers_step3;