import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import { EssayPageProps } from '@/components/templates/essay';
import useBinderAsphaltConcreteStore, {
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcreteResume = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData, step2Data, step3Data, step4Data, step5Data, _id } = useBinderAsphaltConcreteStore();

  const samples: BinderAsphaltConcreteData = {
    generalData,
    step2Data,
    step3Data,
    step4Data,
    step5Data,
    _id,
  };

  // ==================== STEP 1 - IDENTIFICAÇÃO ====================
  const identificacaoFields = [
    { title: 'IDENTIFICAÇÃO', value: generalData?.identification || generalData?.name },
    { title: 'TIPO DE SEÇÃO', value: generalData?.tipoSecao },
    { title: 'FASE DE MONITORAMENTO', value: generalData?.faseMonitoramento },
    { title: 'LIBERAÇÃO AO TRÁFEGO', value: generalData?.liberacaoTrafico },
    { title: 'UTILIZADA NA CALIBRAÇÃO DO MEDINA', value: generalData?.utilizadaMedina },
    { title: 'UTILIZADA NA CALIBRAÇÃO DO LVECD', value: generalData?.utilizadaLvec },
    { title: 'DADOS CONFIRMADOS PELA ICT', value: generalData?.dadosConfirmadosICT },
    { title: 'OBSERVAÇÕES', value: generalData?.observations },
  ];

  // ==================== STEP 1 - PREPARO DO PAVIMENTO ====================
  const preparoPavimentoFields = [
    { title: 'IRI (m/km) PRÉ-REABILITAÇÃO', value: generalData?.iriPreReabilitacao },
    { title: 'AT (%) PRÉ-REABILITAÇÃO', value: generalData?.atPreReabilitacao },
    { title: 'FRESAGEM', value: generalData?.fresagem },
    { title: 'ESPESSURA FRESADA (mm)', value: generalData?.espessuraFresagem },
    { title: 'INTERVENÇÃO NA BASE', value: generalData?.intervencaoBase },
    { title: 'SAMI', value: generalData?.sami },
    { title: 'PINTURA DE LIGAÇÃO', value: generalData?.pinturaLigacao },
    { title: 'IMPRIMAÇÃO', value: generalData?.imprimacao },
  ];

  // ==================== STEP 1 - DATA ÚLTIMA ATUALIZAÇÃO ====================
  const dataAtualizacaoFields = [
    { title: 'DATA DA ÚLTIMA ATUALIZAÇÃO', value: generalData?.dataUltimaAtualizacao },
    { title: 'TEMPO EM SERVIÇO (ANOS)', value: generalData?.tempoServicoAnos },
    { title: 'TEMPO EM SERVIÇO (MESES)', value: generalData?.tempoServicoMeses },
  ];

  // ==================== STEP 1 - CARACTERÍSTICAS ====================
  const caracteristicasFields = [
    { title: 'LOCAL (RODOVIA/AVENIDA)', value: generalData?.local },
    { title: 'MUNICÍPIO/ESTADO', value: generalData?.municipioEstado },
    { title: 'EXTENSÃO (m)', value: generalData?.extensao },
    { title: 'VELOCIDADE DIRETRIZ DA VIA (km/h)', value: generalData?.velocidadeDiretriz },
    { title: 'KM INICIAL', value: generalData?.kmInicial },
    { title: 'KM FINAL', value: generalData?.kmFinal },
    { title: 'INÍCIO - ESTACA', value: generalData?.inicioEstaca },
    { title: 'INÍCIO - METROS', value: generalData?.inicioMetros },
    { title: 'FIM - ESTACA', value: generalData?.fimEstaca },
    { title: 'FIM - METROS', value: generalData?.fimMetros },
    { title: 'ALTITUDE MÉDIA (m)', value: generalData?.altitudeMedia },
    { title: 'NÚMERO DE FAIXAS', value: generalData?.numeroFaixas },
    { title: 'FAIXA MONITORADA', value: generalData?.faixaMonitorada },
    { title: 'LARGURA DA FAIXA (m)', value: generalData?.larguraFaixa },
  ];

  // ==================== STEP 2 - COORDENADAS ====================
  const coordinatesFields = [
    { title: 'ESTACA/METROS INICIAL', value: step2Data?.initialStakeMeters },
    { title: 'LATITUDE INICIAL', value: step2Data?.latitudeI },
    { title: 'LONGITUDE INICIAL', value: step2Data?.longitudeI },
    { title: 'ESTACA/METROS FINAL', value: step2Data?.finalStakeMeters },
    { title: 'LATITUDE FINAL', value: step2Data?.latitudeF },
    { title: 'LONGITUDE FINAL', value: step2Data?.longitudeF },
  ];

  // ==================== STEP 2 - COMPOSIÇÃO ESTRUTURAL ====================
  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'CAMADA' },
    { field: 'material', headerName: 'MATERIAL' },
    { field: 'thickness', headerName: 'ESPESSURA (mm)' },
  ];

  const rows = step2Data?.structuralComposition?.map((item, index) => ({
    id: index,
    layer: item.layer,
    material: item.material,
    thickness: item.thickness ? `${item.thickness} mm` : '-',
  }));

  // ==================== STEP 3 ====================
  const tratamentoFields = [
    { title: 'TIPO DE TRATAMENTO', value: step3Data?.tipoTratamento },
    { title: 'TIPO DE EMULSÃO', value: step3Data?.tipoEmulsao },
    { title: 'TAXA DE EMULSÃO (l/m²)', value: step3Data?.taxaEmulsao },
    { title: 'TAXA DE AGREGADOS POR CAMADA (kg/m²)', value: step3Data?.taxaAgregados },
    { title: 'FAIXA GRANULOMÉTRICA', value: step3Data?.faixaGranulometrica },
    { title: 'ABRASÃO LOS ANGELES (%)', value: step3Data?.abrasaoLosAngeles },
    { title: 'MASSA ESPECÍFICA (g/cm³)', value: step3Data?.massaEspecifica },
  ];

  const emulsaoFields = [
    { title: 'REFERÊNCIA COMERCIAL', value: step3Data?.referenciaComercial },
    { title: 'REFINARIA', value: step3Data?.refinaria },
    { title: 'EMPRESA DISTRIBUIDORA', value: step3Data?.empresaDistribuidora },
    { title: 'DATA DO CARREGAMENTO', value: step3Data?.dataCarregamento },
    { title: 'NÚMERO DA NOTA FISCAL', value: step3Data?.numeroNotaFiscal },
    { title: 'DATA DA NOTA FISCAL', value: step3Data?.dataNotaFiscal },
    { title: 'NÚMERO DO CERTIFICADO', value: step3Data?.numeroCertificado },
    { title: 'DATA DO CERTIFICADO', value: step3Data?.dataCertificado },
  ];

  const parametrosFields = [
    { title: 'VISCOSIDADE (SSF)', value: step3Data?.viscosidadeSSF },
    { title: 'PENEIRAÇÃO (%)', value: step3Data?.peneiracao },
    { title: 'RESÍDUO (%)', value: step3Data?.residuo },
    { title: 'CARGA DE PARTÍCULA', value: step3Data?.cargaParticula },
    { title: 'PENETRAÇÃO (mm)', value: step3Data?.penetracao },
    { title: 'RECUPERAÇÃO ELÁSTICA (%)', value: step3Data?.recuperacaoElastica },
    { title: 'PONTO DE AMOLECIMENTO (°C)', value: step3Data?.pontoAmolecimento },
  ];

  // ==================== STEP 4 ====================
  const comerciaisFields = [
    { title: 'REFERÊNCIA COMERCIAL', value: step4Data?.referenciaComercial },
    { title: 'REFINARIA', value: step4Data?.refinaria },
    { title: 'EMPRESA DISTRIBUIDORA', value: step4Data?.empresaDistribuidora },
    { title: 'DATA DO CARREGAMENTO', value: step4Data?.dataCarregamento },
    { title: 'NÚMERO DA NOTA FISCAL', value: step4Data?.numeroNotaFiscal },
    { title: 'DATA DA NOTA FISCAL', value: step4Data?.dataNotaFiscal },
    { title: 'NÚMERO DO CERTIFICADO', value: step4Data?.numeroCertificado },
    { title: 'DATA DO CERTIFICADO', value: step4Data?.dataCertificado },
  ];

  const originalFields = [
    { title: 'TIPO DE CAP', value: step4Data?.tipoCAP },
    { title: 'PERFORMANCE GRADE (PG)', value: step4Data?.performanceGrade },
    { title: 'PENETRAÇÃO (mm) - 25°C', value: step4Data?.penetracao25 },
    { title: 'PONTO DE AMOLECIMENTO (°C)', value: step4Data?.pontoAmolecimento },
    { title: 'VISCOSIDADE BROOKFIELD 135°C (cP)', value: step4Data?.viscosidadeBrookfield_135 },
    { title: 'VISCOSIDADE BROOKFIELD 150°C (cP)', value: step4Data?.viscosidadeBrookfield_150 },
    { title: 'VISCOSIDADE BROOKFIELD 177°C (cP)', value: step4Data?.viscosidadeBrookfield_177 },
    { title: 'RECUPERAÇÃO ELÁSTICA (%)', value: step4Data?.recuperacaoElastica },
  ];

  const mscrFields = [
    { title: 'MSCR - JNR 3,2 (1/KPA)', value: step4Data?.mscr_Jnr_3_2 },
    { title: 'MSCR - JNDIFF (%)', value: step4Data?.mscr_Jndiff },
  ];

  const lasFields = [
    { title: 'TEMPERATURA DO TESTE (°C)', value: step4Data?.las_temperatura },
    { title: 'LAS - STRAIN 1,25% - Nº', value: step4Data?.las_strain_1_25 },
    { title: 'LAS - STRAIN 2,5% - Nº', value: step4Data?.las_strain_2_5 },
    { title: 'LAS - STRAIN 5% - Nº', value: step4Data?.las_strain_5 },
    { title: 'LAS - AF (COMPRIMENTO NA TRINCA)', value: step4Data?.las_af },
    { title: 'LAS - FFL (FATOR DE FADIGA)', value: step4Data?.las_FFL },
    { title: 'LAS - D³', value: step4Data?.las_D },
  ];

  const bbrFields = [
    { title: 'BBR - MÓDULO DE RIGIDEZ S (MPa)', value: step4Data?.bbr_S },
    { title: 'BBR - COEFICIENTE ANGULAR M (MPa)', value: step4Data?.bbr_m },
    { title: 'TEMPERATURA DO TESTE (°C)', value: step4Data?.bbr_temp },
  ];

  // ==================== STEP 5 ====================
  const geraisFields = [
    { title: 'TIPO DE CAP', value: step5Data?.tipoCAP },
    { title: 'MASSA ESPECÍFICA (g/cm³)', value: step5Data?.massaEspecifica },
    { title: 'RESISTÊNCIA À TRAÇÃO (MPa)', value: step5Data?.resistenciaTracao },
    { title: 'TEOR DE ASFALTO (%)', value: step5Data?.teorAsfalto },
    { title: 'VOLUME DE VAZIOS (%)', value: step5Data?.volumeVazios },
    { title: 'FAIXA GRANULOMÉTRICA', value: step5Data?.faixaGranulometrica },
    { title: 'TMN (mm)', value: step5Data?.tmn },
    { title: 'ABRASÃO LOS ANGELES (%)', value: step5Data?.abrasaoLosAngeles },
    { title: 'FLOW NUMBER (FN)', value: step5Data?.flowNumber },
    { title: 'MÓDULO DE RESILIÊNCIA 25°C (MPa)', value: step5Data?.moduloResiliencia },
  ];

  const curvaFadigaFields = [
    { title: 'Nº DE AMOSTRAS (CPs) CONSIDERADAS', value: step5Data?.curvaFadiga_n_cps },
    { title: 'COEFICIENTE DE REGRESSÃO (k1)', value: step5Data?.curvaFadiga_k1 },
    { title: 'COEFICIENTE DE REGRESSÃO (k2)', value: step5Data?.curvaFadiga_k2 },
    { title: 'COEF. DE DETERMINAÇÃO DO AJUSTE (R²)', value: step5Data?.curvaFadiga_r2 },
  ];

  const sigmoidalFields = [
    { title: 'COEFICIENTE a', value: step5Data?.sigmoidal_a },
    { title: 'COEFICIENTE b', value: step5Data?.sigmoidal_b },
    { title: 'COEFICIENTE d', value: step5Data?.sigmoidal_d },
    { title: 'COEFICIENTE g', value: step5Data?.sigmoidal_g },
    { title: 'COEFICIENTE a1', value: step5Data?.sigmoidal_a1 },
    { title: 'COEFICIENTE a2', value: step5Data?.sigmoidal_a2 },
    { title: 'COEFICIENTE a3', value: step5Data?.sigmoidal_a3 },
  ];

  const danoFields = [
    { title: 'PARÂMETRO "α" DE EVOLUÇÃO DO DANO', value: step5Data?.parametro_alfa },
    { title: 'C₁₀', value: step5Data?.dano_C10 },
    { title: 'C₁₁', value: step5Data?.dano_C11 },
    { title: 'C₁₂', value: step5Data?.dano_C12 },
    { title: 'a', value: step5Data?.dano_a },
    { title: 'b', value: step5Data?.dano_b },
    { title: 'Y', value: step5Data?.dano_Y },
    { title: 'Δ', value: step5Data?.dano_Delta },
  ];

  const shiftModelFields = [
    { title: 'Nº DE AMOSTRAS (CPs) CONSIDERADAS', value: step5Data?.shiftModel_n_cps },
    { title: 'ε₀', value: step5Data?.shiftModel_ε0 },
    { title: 'N1', value: step5Data?.shiftModel_N1 },
    { title: 'β', value: step5Data?.shiftModel_β },
    { title: 'p1', value: step5Data?.shiftModel_p1 },
    { title: 'p2', value: step5Data?.shiftModel_p2 },
    { title: 'd1', value: step5Data?.shiftModel_d1 },
    { title: 'd2', value: step5Data?.shiftModel_d2 },
  ];

  const sections = [
    'step1-identificacao', 'step1-preparo', 'step1-data', 'step1-caracteristicas',
    'step2-coordinates', 'step2-structural-composition',
    'step3-tratamento', 'step3-emulsao', 'step3-parametros',
    'step4-comerciais', 'step4-original', 'step4-dsr-original', 'step4-rtfot',
    'step4-mscr', 'step4-las', 'step4-bbr',
    'step5-gerais', 'step5-fadiga', 'step5-sigmoidal', 'step5-dano', 'step5-prony', 'step5-shift',
  ];

  // ==================== HELPER DE RENDERIZAÇÃO ====================
  const renderFields = (fields: { title: string; value: any }[], cols = '1fr 1fr 1fr 1fr') => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: cols },
        justifyItems: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {fields.map((item, idx) =>
        item.value ? (
          <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.value}</Typography>
          </Box>
        ) : null
      )}
    </Box>
  );

  setNextDisabled(false);

  return (
    <>
      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: '3rem' }}>
        <Box
          sx={{
            width: { mobile: '90%', notebook: '100%' },
            maxWidth: '2200px',
            padding: '2rem',
            borderRadius: '20px',
            bgcolor: 'primaryTons.white',
            border: '1px solid',
            borderColor: 'primaryTons.border',
            margin: '1rem',
            marginTop: '1rem',
          }}
        >
          <GeneratePDF_ProMedina sample={samples} sections={sections} />

          {/* STEP 1 - IDENTIFICAÇÃO */}
          <Box id="step1-identificacao" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="IDENTIFICAÇÃO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(identificacaoFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 1 - PREPARO DO PAVIMENTO */}
          <Box id="step1-preparo" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(preparoPavimentoFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 1 - DATA DA ÚLTIMA ATUALIZAÇÃO */}
          <Box id="step1-data" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DATA DA ÚLTIMA ATUALIZAÇÃO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(dataAtualizacaoFields, '1fr 1fr')}
            </FlexColumnBorder>
          </Box>

          {/* STEP 1 - CARACTERÍSTICAS */}
          <Box id="step1-caracteristicas" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CARACTERÍSTICAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(caracteristicasFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 1 - COMPOSIÇÃO ESTRUTURAL */}
          {(generalData?.camadasEstruturais && generalData.camadasEstruturais.length > 0) && (
            <Box id="step1-composicao" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
              <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <DataGrid
                    rows={generalData.camadasEstruturais.map((item: any, index: number) => ({
                      id: index,
                      layer: item.tipo || '-',
                      material: item.material || '-',
                      thickness: item.espessura ? `${item.espessura} mm` : '-',
                    }))}
                    hideFooter
                    disableColumnMenu
                    disableColumnFilter
                    columns={[
                      { field: 'layer', headerName: 'CAMADA', flex: 1, headerAlign: 'center', align: 'center' },
                      { field: 'material', headerName: 'MATERIAL', flex: 1, headerAlign: 'center', align: 'center' },
                      { field: 'thickness', headerName: 'ESPESSURA (mm)', flex: 1, headerAlign: 'center', align: 'center' },
                    ]}
                  />
                </Box>
                {generalData?.imagemEstrutural && (
                  <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <Typography sx={{ fontWeight: 'bold', color: 'black' }}>IMAGEM DA COMPOSIÇÃO ESTRUTURAL</Typography>
                    <img src={generalData.imagemEstrutural} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                    <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                    <Typography sx={{ color: 'black' }}>{generalData?.dataImagens || '-'}</Typography>
                  </Box>
                )}
              </FlexColumnBorder>
            </Box>
          )}

          {/* STEP 2 - COORDENADAS */}
          <Box id="step2-coordinates" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(coordinatesFields, '1fr 1fr 1fr')}
            </FlexColumnBorder>
          </Box>

          {/* STEP 2 - COMPOSIÇÃO ESTRUTURAL */}
          <Box id="step2-structural-composition" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {rows && rows.length > 0 && (
                  <DataGrid
                    rows={rows}
                    hideFooter
                    disableColumnMenu
                    disableColumnFilter
                    columns={columns.map((column) => ({
                      ...column,
                      disableColumnMenu: true,
                      sortable: false,
                      align: 'center',
                      headerAlign: 'center',
                      minWidth: 100,
                      flex: 1,
                    }))}
                  />
                )}
              </Box>
              {step2Data?.images && (
                <Box sx={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'black' }}>IMAGEM DA COMPOSIÇÃO ESTRUTURAL</Typography>
                  <img src={step2Data.images} alt="Estrutura" width="250px" height="250px" style={{ borderRadius: '8px' }} />
                  <Typography sx={{ color: 'gray' }}>DATA DA IMAGEM</Typography>
                  <Typography sx={{ color: 'black' }}>{step2Data?.imagesDate || '-'}</Typography>
                </Box>
              )}
            </FlexColumnBorder>
          </Box>

          {/* STEP 3 - TRATAMENTO SUPERFICIAL */}
          <Box id="step3-tratamento" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="TRATAMENTO SUPERFICIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(tratamentoFields)}
            </FlexColumnBorder>
          </Box>

          <Box id="step3-emulsao" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="EMULSÃO ASFÁLTICA" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(emulsaoFields)}
            </FlexColumnBorder>
          </Box>

          <Box id="step3-parametros" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(parametrosFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - DADOS COMERCIAIS */}
          <Box id="step4-comerciais" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(comerciaisFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - LIGANTE ORIGINAL */}
          <Box id="step4-original" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(originalFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - DSR ORIGINAL (dinâmico) */}
          <Box id="step4-dsr-original" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DSR - LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {(step4Data?.dsr_original || []).length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                    justifyItems: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {(step4Data?.dsr_original || []).map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        TEMPERATURA {index + 1} (°C)
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.temp || '-'}</Typography>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        G*/sen(δ) (MPa)
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.G_sen || '-'}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ textAlign: 'center', color: 'gray', fontSize: '14px' }}>Nenhum dado cadastrado.</Typography>
              )}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - DSR RTFOT (dinâmico) */}
          <Box id="step4-rtfot" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LIGANTE ENVELHECIDO RTFOT" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {(step4Data?.dsr_rtfot || []).length > 0 ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                    justifyItems: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {(step4Data?.dsr_rtfot || []).map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        TEMPERATURA {index + 1} (°C)
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.temp || '-'}</Typography>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        G*/sen(δ) (MPa)
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{item.G_sen || '-'}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ textAlign: 'center', color: 'gray', fontSize: '14px' }}>Nenhum dado cadastrado.</Typography>
              )}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - MSCR */}
          <Box id="step4-mscr" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="MSCR" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(mscrFields, '1fr 1fr')}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - LAS */}
          <Box id="step4-las" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(lasFields, '1fr 1fr 1fr')}
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - BBR */}
          <Box id="step4-bbr" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="BBR (RTFOT + PAV)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(bbrFields, '1fr 1fr 1fr')}
            </FlexColumnBorder>
          </Box>

          {/* STEP 5 - PROPRIEDADES GERAIS */}
          <Box id="step5-gerais" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PROPRIEDADES GERAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(geraisFields, '1fr 1fr 1fr')}
            </FlexColumnBorder>
          </Box>

          {/* STEP 5 - CURVA DE FADIGA */}
          <Box id="step5-fadiga" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(curvaFadigaFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 5 - CURVAS-MESTRAS */}
          <Box id="step5-sigmoidal" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVAS-MESTRAS (FUNÇÃO SIGMOIDAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(sigmoidalFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 5 - COEFICIENTES G² */}
          <Box id="step5-dano" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO (G²)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(danoFields)}
            </FlexColumnBorder>
          </Box>

          {/* STEP 5 - PRONY */}
          <Box id="step5-prony" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="MÓDULOS DE RELAXAÇÃO (PRONY)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {step5Data?.einf && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>EINF (kPa)</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{step5Data.einf}</Typography>
                  </Box>
                )}
                {(step5Data?.prony_pi || []).map((pi, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>pi (s) - {index + 1}</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pi}</Typography>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Ei (kPa)</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{step5Data?.prony_Ei?.[index]}</Typography>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* STEP 5 - SHIFT MODEL */}
          <Box id="step5-shift" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DO SHIFT MODEL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              {renderFields(shiftModelFields)}
            </FlexColumnBorder>
          </Box>

          {/* OBSERVAÇÕES */}
          {(generalData?.observations || step3Data?.observacoes || step4Data?.observacoes || step5Data?.observacoes) && (
            <Box id="observacoes" sx={{ paddingTop: '1rem', paddingX: '6rem', paddingBottom: '2rem' }}>
              <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
                  {generalData?.observations && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      IDENTIFICAÇÃO: {generalData.observations}
                    </Typography>
                  )}
                  {step3Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      TRATAMENTO SUPERFICIAL: {step3Data.observacoes}
                    </Typography>
                  )}
                  {step4Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      LIGANTE ASFÁLTICO: {step4Data.observacoes}
                    </Typography>
                  )}
                  {step5Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      CONCRETO ASFÁLTICO: {step5Data.observacoes}
                    </Typography>
                  )}
                </Box>
              </FlexColumnBorder>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BinderAsphaltConcreteResume;