import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import samplesService from '@/services/promedina/binder-asphalt-concrete/binder-asphalt-concrete-view.service';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '@/components/molecules/loading';
import Link from 'next/link';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';

const SpecificSample_BinderAsphaltConcrete = () => {
  const [samples, setSamples] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const query = router.query as any;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await samplesService.getSample(query.id);
        setSamples(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
        setLoading(false);
      }
    };

    if (query.id) {
      fetchData();
    }
  }, [query.id]);

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
  ];

  const rows = samples?.step2Data?.structuralComposition?.map((item: any, index: number) => ({
    id: index,
    layer: item.layer || '-',
    material: item.material || '-',
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  })) || [];

  // Função para renderizar seções
  const renderSection = (title: string, data: any, fields: { label: string; key: string; suffix?: string }[]) => {
    if (!data) return null;
    
    const hasData = fields.some(field => {
      const value = data[field.key];
      return value && value !== '-' && value !== '---' && value !== null && value !== '';
    });
    
    if (!hasData) return null;
    
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title={title} open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
              justifyItems: 'center',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '1rem',
            }}
          >
            {fields.map((field, idx) => {
              const value = data[field.key];
              if (!value || value === '-' || value === '---' || value === null || value === '') return null;
              
              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                    {field.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                    {field.suffix ? `${value}${field.suffix}` : value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  // ==================== STEP 1 - DADOS GERAIS ====================
  const generalDataFields = [
    { label: 'NOME', key: 'name' },
    { label: 'LOCAL', key: 'zone' },
    { label: 'CAMADA', key: 'layer' },
    { label: 'MUNICÍPIO/ESTADO', key: 'cityState' },
    { label: 'RODOVIA', key: 'highway' },
    { label: 'VELOCIDADE DIRETRIZ', key: 'guideLineSpeed', suffix: ' km/h' },
    { label: 'OBSERVAÇÕES', key: 'observations' },
  ];

  // ==================== STEP 2 - CARACTERÍSTICAS ====================
  const characteristicsFields = [
    { label: 'LOCAL', key: 'roadName' },
    { label: 'MUNICÍPIO/ESTADO', key: 'cityState' },
    { label: 'EXTENSÃO (m)', key: 'experimentalLength', suffix: ' m' },
    { label: 'VELOCIDADE DIRETRIZ DA VIA (km/h)', key: 'guideSpeed', suffix: ' km/h' },
  ];

  const coordinatesFields = [
    { label: 'ESTACA/METROS INICIAL', key: 'initialStakeMeters' },
    { label: 'LATITUDE INICIAL', key: 'latitudeI' },
    { label: 'LONGITUDE INICIAL', key: 'longitudeI' },
    { label: 'ESTACA/METROS FINAL', key: 'finalStakeMeters' },
    { label: 'LATITUDE FINAL', key: 'latitudeF' },
    { label: 'LONGITUDE FINAL', key: 'longitudeF' },
  ];

  const pavimentDataFields = [
    { label: 'IDENTIFICAÇÃO', key: 'identification' },
    { label: 'TIPO DE SEÇÃO', key: 'sectionType' },
    { label: 'FASE DE MONITORAMENTO', key: 'monitoringPhase' },
    { label: 'LIBERAÇÃO AO TRÁFEGO', key: 'trafficLiberation' },
    { label: 'ALTITUDE MÉDIA (m)', key: 'averageAltitude', suffix: ' m' },
    { label: 'NÚMERO DE FAIXAS', key: 'numberOfTracks' },
    { label: 'FAIXA MONITORADA', key: 'monitoredTrack' },
    { label: 'LARGURA DA FAIXA (m)', key: 'trackWidth', suffix: ' m' },
    { label: 'OBSERVAÇÕES', key: 'observation' },
  ];

  const pavimentPreparationFields = [
    { label: 'IRI (m/km) PRÉ-REABILITAÇÃO', key: 'iriPrerehabilitation', suffix: ' m/km' },
    { label: 'AT (%) PRÉ-REABILITAÇÃO', key: 'atPrerehabilitation', suffix: ' %' },
    { label: 'FRESAGEM (cm)', key: 'millingThickness', suffix: ' cm' },
    { label: 'INTERVENÇÃO NA BASE', key: 'interventionAtTheBase' },
    { label: 'SAMI', key: 'sami' },
    { label: 'PINTURA DE LIGAÇÃO', key: 'bondingPaint' },
    { label: 'IMPRIMAÇÃO', key: 'priming' },
  ];

  const serviceTimeFields = [
    { label: 'TEMPO EM SERVIÇO (ANOS)', key: 'serviceTimeYears', suffix: ' anos' },
    { label: 'TEMPO EM SERVIÇO (MESES)', key: 'serviceTimeMonths', suffix: ' meses' },
  ];

  // ==================== STEP 3 - TRATAMENTO SUPERFICIAL ====================
  const tratamentoFields = [
    { label: 'Tipo de Tratamento', key: 'tipoTratamento' },
    { label: 'Tipo de Emulsão', key: 'tipoEmulsao' },
    { label: 'Taxa de Emulsão (l/m²)', key: 'taxaEmulsao', suffix: ' l/m²' },
    { label: 'Taxa de Agregados (kg/m²)', key: 'taxaAgregados', suffix: ' kg/m²' },
    { label: 'Faixa Granulométrica', key: 'faixaGranulometrica' },
    { label: 'Abrasão Los Angeles (%)', key: 'abrasaoLosAngeles', suffix: ' %' },
    { label: 'Massa Específica (g/cm³)', key: 'massaEspecifica', suffix: ' g/cm³' },
  ];

  const emulsaoFields = [
    { label: 'Referência Comercial', key: 'referenciaComercial' },
    { label: 'Refinaria', key: 'refinaria' },
    { label: 'Empresa Distribuidora', key: 'empresaDistribuidora' },
    { label: 'Data do Carregamento', key: 'dataCarregamento' },
    { label: 'Número da Nota Fiscal', key: 'numeroNotaFiscal' },
    { label: 'Data da Nota Fiscal', key: 'dataNotaFiscal' },
    { label: 'Número do Certificado', key: 'numeroCertificado' },
    { label: 'Data do Certificado', key: 'dataCertificado' },
  ];

  const parametrosFields = [
    { label: 'Viscosidade (SSF)', key: 'viscosidadeSSF' },
    { label: 'Peneiração (%)', key: 'peneiracao', suffix: ' %' },
    { label: 'Resíduo (%)', key: 'residuo', suffix: ' %' },
    { label: 'Carga de Partícula', key: 'cargaParticula' },
    { label: 'Penetração (mm)', key: 'penetracao', suffix: ' mm' },
    { label: 'Recuperação Elástica (%)', key: 'recuperacaoElastica', suffix: ' %' },
    { label: 'Ponto de Amolecimento (°C)', key: 'pontoAmolecimento', suffix: ' °C' },
  ];

  // ==================== STEP 4 - LIGANTE ASFÁLTICO ====================
  const comerciaisFields = [
    { label: 'Referência Comercial', key: 'referenciaComercial' },
    { label: 'Refinaria', key: 'refinaria' },
    { label: 'Empresa Distribuidora', key: 'empresaDistribuidora' },
    { label: 'Data do Carregamento', key: 'dataCarregamento' },
    { label: 'Número da Nota Fiscal', key: 'numeroNotaFiscal' },
    { label: 'Data da Nota Fiscal', key: 'dataNotaFiscal' },
    { label: 'Número do Certificado', key: 'numeroCertificado' },
    { label: 'Data do Certificado', key: 'dataCertificado' },
  ];

  const originalFields = [
    { label: 'Tipo de CAP', key: 'tipoCAP' },
    { label: 'Performance Grade (PG)', key: 'performanceGrade' },
    { label: 'Penetração (mm) - 25°C', key: 'penetracao25', suffix: ' mm' },
    { label: 'Ponto de Amolecimento (°C)', key: 'pontoAmolecimento', suffix: ' °C' },
    { label: 'Viscosidade Brookfield 135°C (cP)', key: 'viscosidadeBrookfield_135', suffix: ' cP' },
    { label: 'Viscosidade Brookfield 150°C (cP)', key: 'viscosidadeBrookfield_150', suffix: ' cP' },
    { label: 'Viscosidade Brookfield 177°C (cP)', key: 'viscosidadeBrookfield_177', suffix: ' cP' },
    { label: 'Recuperação Elástica (%)', key: 'recuperacaoElastica', suffix: ' %' },
  ];

  const dsrOriginalFields = [
    { label: 'DSR - G*/sen(δ) (MPa)', key: 'dsr_original_G_sen', suffix: ' MPa' },
    { label: 'Temperatura do Teste (°C)', key: 'dsr_original_temp', suffix: ' °C' },
  ];

  const dsrRtfotFields = [
    { label: 'DSR RTFOT - G*/sen(δ) (MPa)', key: 'dsr_rtfot_G_sen', suffix: ' MPa' },
    { label: 'Temperatura do Teste (°C)', key: 'dsr_rtfot_temp', suffix: ' °C' },
  ];

  const mscrFields = [
    { label: 'MSCR - Jnr 3,2 (1/kPa)', key: 'mscr_Jnr_3_2', suffix: ' 1/kPa' },
    { label: 'MSCR - Jndiff (%)', key: 'mscr_Jndiff', suffix: ' %' },
  ];

  const lasFields = [
    { label: 'LAS - Strain 1,25% - Nº', key: 'las_strain_1_25' },
    { label: 'LAS - Strain 2,5% - Nº', key: 'las_strain_2_5' },
    { label: 'LAS - Strain 5% - Nº', key: 'las_strain_5' },
    { label: 'LAS - af (comprimento na trinca)', key: 'las_af' },
    { label: 'LAS - FFL (Fator de fadiga)', key: 'las_FFL' },
    { label: 'LAS - D³', key: 'las_D' },
  ];

  const bbrFields = [
    { label: 'BBR - Módulo de rigidez S (MPa)', key: 'bbr_S', suffix: ' MPa' },
    { label: 'BBR - Coeficiente angular m (MPa)', key: 'bbr_m', suffix: ' MPa' },
    { label: 'Temperatura do Teste (°C)', key: 'bbr_temp', suffix: ' °C' },
  ];

  // ==================== STEP 5 - CONCRETO ASFÁLTICO ====================
  const geraisFields = [
    { label: 'Tipo de CAP', key: 'tipoCAP' },
    { label: 'Massa Específica (g/cm³)', key: 'massaEspecifica', suffix: ' g/cm³' },
    { label: 'Resistência à Tração (MPa)', key: 'resistenciaTracao', suffix: ' MPa' },
    { label: 'Teor de Asfalto (%)', key: 'teorAsfalto', suffix: ' %' },
    { label: 'Volume de Vazios (%)', key: 'volumeVazios', suffix: ' %' },
    { label: 'Faixa Granulométrica', key: 'faixaGranulometrica' },
    { label: 'TMN (mm)', key: 'tmn', suffix: ' mm' },
    { label: 'Abrasão Los Angeles (%)', key: 'abrasaoLosAngeles', suffix: ' %' },
    { label: 'Flow Number (FN)', key: 'flowNumber' },
    { label: 'Módulo de Resiliência 25°C (MPa)', key: 'moduloResiliencia', suffix: ' MPa' },
  ];

  const curvaFadigaFields = [
    { label: 'Nº de Amostras (CPs)', key: 'curvaFadiga_n_cps' },
    { label: 'Coeficiente de Regressão (k1)', key: 'curvaFadiga_k1' },
    { label: 'Coeficiente de Regressão (k2)', key: 'curvaFadiga_k2' },
    { label: 'Coef. de Determinação (R²)', key: 'curvaFadiga_r2' },
  ];

  const sigmoidalFields = [
    { label: 'Coeficiente a', key: 'sigmoidal_a' },
    { label: 'Coeficiente b', key: 'sigmoidal_b' },
    { label: 'Coeficiente d', key: 'sigmoidal_d' },
    { label: 'Coeficiente g', key: 'sigmoidal_g' },
    { label: 'Coeficiente a1', key: 'sigmoidal_a1' },
    { label: 'Coeficiente a2', key: 'sigmoidal_a2' },
    { label: 'Coeficiente a3', key: 'sigmoidal_a3' },
  ];

  const danoFields = [
    { label: 'Parâmetro "α" de evolução do dano', key: 'parametro_alfa' },
    { label: 'C₁₀', key: 'dano_C10' },
    { label: 'C₁₁', key: 'dano_C11' },
    { label: 'C₁₂', key: 'dano_C12' },
    { label: 'a', key: 'dano_a' },
    { label: 'b', key: 'dano_b' },
    { label: 'Y', key: 'dano_Y' },
    { label: 'Δ', key: 'dano_Delta' },
  ];

  const shiftModelFields = [
    { label: 'Nº de Amostras (CPs)', key: 'shiftModel_n_cps' },
    { label: 'ε₀', key: 'shiftModel_ε0' },
    { label: 'N1', key: 'shiftModel_N1' },
    { label: 'β', key: 'shiftModel_β' },
    { label: 'p1', key: 'shiftModel_p1' },
    { label: 'p2', key: 'shiftModel_p2' },
    { label: 'd1', key: 'shiftModel_d1' },
    { label: 'd2', key: 'shiftModel_d2' },
  ];

  // Seção especial para PRONY
  const renderPronySection = () => {
    const pronyPi = samples?.step5Data?.prony_pi || [];
    const pronyEi = samples?.step5Data?.prony_Ei || [];
    const einf = samples?.step5Data?.einf;
    
    if (pronyPi.length === 0 && pronyEi.length === 0 && !einf) return null;
    
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title="MÓDULOS DE RELAXAÇÃO (PRONY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
              justifyItems: 'center',
              alignItems: 'center',
              gap: '1rem',
              paddingBottom: '1rem',
            }}
          >
            {einf && einf !== '-' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Einf (kPa)</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{einf}</Typography>
              </Box>
            )}
            {pronyPi.map((pi: string, index: number) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>pi (s) - {index + 1}</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pi || '-'}</Typography>
                <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Ei (kPa)</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pronyEi[index] || '-'}</Typography>
              </Box>
            ))}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  // Seção de observações
  const renderObservacoesSection = () => {
    const hasObs = samples?.step3Data?.observacoes || samples?.step4Data?.observacoes || samples?.step5Data?.observacoes;
    if (!hasObs) return null;
    
    return (
      <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
        <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
            {samples?.step3Data?.observacoes && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>Tratamento Superficial</Typography>
                <Typography>{samples.step3Data.observacoes}</Typography>
              </Box>
            )}
            {samples?.step4Data?.observacoes && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>Ligante Asfáltico</Typography>
                <Typography>{samples.step4Data.observacoes}</Typography>
              </Box>
            )}
            {samples?.step5Data?.observacoes && (
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: 'gray' }}>Concreto Asfáltico</Typography>
                <Typography>{samples.step5Data.observacoes}</Typography>
              </Box>
            )}
          </Box>
        </FlexColumnBorder>
      </Box>
    );
  };

  if (loading) {
    return <Loading size={30} color={'secondary'} />;
  }

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
      <Box
        sx={{
          width: { mobile: '95%', notebook: '85%' },
          maxWidth: '2200px',
          padding: '2rem',
          borderRadius: '20px',
          bgcolor: 'primaryTons.white',
          border: '1px solid',
          borderColor: 'primaryTons.border',
          margin: '1rem',
        }}
      >
        {/* STEP 1 - DADOS GERAIS */}
        {renderSection('DADOS GERAIS', samples?.generalData, generalDataFields)}

        {/* STEP 2 - CARACTERÍSTICAS */}
        {renderSection('CARACTERÍSTICAS', samples?.step2Data, characteristicsFields)}

        {/* STEP 2 - COORDENADAS */}
        {renderSection('COORDENADAS', samples?.step2Data, coordinatesFields)}

        {/* STEP 2 - DADOS DO PAVIMENTO */}
        {renderSection('DADOS DO PAVIMENTO', samples?.step2Data, pavimentDataFields)}

        {/* STEP 2 - PREPARO DO PAVIMENTO */}
        {renderSection('PREPARO DO PAVIMENTO', samples?.step2Data, pavimentPreparationFields)}

        {/* STEP 2 - TEMPO EM SERVIÇO */}
        {renderSection('TEMPO EM SERVIÇO', samples?.step2Data, serviceTimeFields)}

        {/* STEP 2 - DATA DA ÚLTIMA ATUALIZAÇÃO */}
        {samples?.step2Data?.lastUpdate && samples.step2Data.lastUpdate !== '-' && (
          <Box sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
            <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', paddingBottom: '1rem' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                  {samples.step2Data.lastUpdate}
                </Typography>
              </Box>
            </FlexColumnBorder>
          </Box>
        )}

        {/* STEP 2 - COMPOSIÇÃO ESTRUTURAL */}
        <Box id="structural-composition" sx={{ paddingTop: '1rem', paddingX: { mobile: '1rem', notebook: '6rem' } }}>
          <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ height: 'fit-content', width: '100%' }}>
                <DataGrid
                  rows={rows}
                  hideFooter
                  disableColumnMenu
                  disableColumnFilter
                  columns={columns}
                  sx={{ borderRadius: '10px' }}
                />
              </div>
            </Box>
            {samples?.step2Data?.images && samples?.step2Data?.images !== '-' && (
              <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                <Typography sx={{ fontWeight: 'bold', marginTop: '0.5rem', color: 'black' }}>
                  IMAGEM DA COMPOSIÇÃO ESTRUTURAL
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={samples.step2Data.images}
                    alt="Estrutura"
                    width="250px"
                    height="250px"
                    style={{ borderRadius: '8px', objectFit: 'contain' }}
                  />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{samples.step2Data.imagesDate || '-'}</Typography>
                </Box>
              </Box>
            )}
          </FlexColumnBorder>
        </Box>

        {/* STEP 3 - TRATAMENTO SUPERFICIAL */}
        {renderSection('TRATAMENTO SUPERFICIAL', samples?.step3Data, tratamentoFields)}
        {renderSection('EMULSÃO ASFÁLTICA', samples?.step3Data, emulsaoFields)}
        {renderSection('PARÂMETROS DO MATERIAL', samples?.step3Data, parametrosFields)}

        {/* STEP 4 - LIGANTE ASFÁLTICO */}
        {renderSection('DADOS COMERCIAIS', samples?.step4Data, comerciaisFields)}
        {renderSection('LIGANTE ORIGINAL', samples?.step4Data, originalFields)}
        {renderSection('DSR - LIGANTE ORIGINAL', samples?.step4Data, dsrOriginalFields)}
        {renderSection('LIGANTE ENVELHECIDO RTFOT', samples?.step4Data, dsrRtfotFields)}
        {renderSection('MSCR', samples?.step4Data, mscrFields)}
        {renderSection('LAS', samples?.step4Data, lasFields)}
        {renderSection('BBR (RTFOT + PAV)', samples?.step4Data, bbrFields)}

        {/* STEP 5 - CONCRETO ASFÁLTICO */}
        {renderSection('PROPRIEDADES GERAIS', samples?.step5Data, geraisFields)}
        {renderSection('CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)', samples?.step5Data, curvaFadigaFields)}
        {renderSection('CURVAS-MESTRAS (FUNÇÃO SIGMOIDAL)', samples?.step5Data, sigmoidalFields)}
        {renderSection('COEFICIENTES DE REGRESSÃO (G²)', samples?.step5Data, danoFields)}
        {renderSection('COEFICIENTES DE REGRESSÃO DO SHIFT MODEL', samples?.step5Data, shiftModelFields)}
        
        {/* PRONY */}
        {renderPronySection()}

        {/* OBSERVAÇÕES */}
        {renderObservacoesSection()}
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { mobile: '4vh 4vw', notebook: '3vh 6vw' },
        }}
      >
        <Link
          href="/promedina/binder-asphalt-concrete/view"
          style={{
            backgroundColor: '#00A3FF',
            color: '#FFFFFF',
            height: '32px',
            width: '140px',
            fontSize: '1.2rem',
            alignItems: 'center',
            border: 'none',
            borderRadius: '30px',
            textAlign: 'center',
            fontWeight: 'bold',
            paddingTop: '0.2rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {t('button-previous')}
        </Link>
      </Box>
    </Box>
  );
};

export default SpecificSample_BinderAsphaltConcrete;