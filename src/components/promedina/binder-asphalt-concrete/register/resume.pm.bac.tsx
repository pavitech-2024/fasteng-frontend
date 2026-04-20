import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import GeneratePDF_ProMedina from '@/components/generatePDF/promedina/granularLayers/generatePDF.promedina';
import { EssayPageProps } from '@/components/templates/essay';
import useBinderAsphaltConcreteStore, {
  BinderAsphaltConcreteData,
} from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

const BinderAsphaltConcreteResume = ({ setNextDisabled }: EssayPageProps) => {
  const { generalData: data, step2Data, step3Data, step4Data, _id } = useBinderAsphaltConcreteStore();
  const samples: BinderAsphaltConcreteData = {
    generalData: { ...data },
    step2Data,
    step3Data,
    step4Data,
    _id,
  };

  // ==================== STEP 2 - TRATAMENTO SUPERFICIAL ====================
  const tratamentoFields = [
    { title: 'Tipo de Tratamento', value: step2Data?.tipoTratamento },
    { title: 'Tipo de Emulsão', value: step2Data?.tipoEmulsao },
    { title: 'Taxa de Emulsão (l/m²)', value: step2Data?.taxaEmulsao },
    { title: 'Taxa de Agregados (kg/m²)', value: step2Data?.taxaAgregados },
    { title: 'Faixa Granulométrica', value: step2Data?.faixaGranulometrica },
    { title: 'Abrasão Los Angeles (%)', value: step2Data?.abrasaoLosAngeles },
    { title: 'Massa Específica (g/cm³)', value: step2Data?.massaEspecifica },
  ];

  const emulsaoFields = [
    { title: 'Referência Comercial', value: step2Data?.referenciaComercial },
    { title: 'Refinaria', value: step2Data?.refinaria },
    { title: 'Empresa Distribuidora', value: step2Data?.empresaDistribuidora },
    { title: 'Data do Carregamento', value: step2Data?.dataCarregamento },
    { title: 'Número da Nota Fiscal', value: step2Data?.numeroNotaFiscal },
    { title: 'Data da Nota Fiscal', value: step2Data?.dataNotaFiscal },
    { title: 'Número do Certificado', value: step2Data?.numeroCertificado },
    { title: 'Data do Certificado', value: step2Data?.dataCertificado },
  ];

  const parametrosFields = [
    { title: 'Viscosidade (SSF)', value: step2Data?.viscosidadeSSF },
    { title: 'Peneiração (%)', value: step2Data?.peneiracao },
    { title: 'Resíduo (%)', value: step2Data?.residuo },
    { title: 'Carga de Partícula', value: step2Data?.cargaParticula },
    { title: 'Penetração (mm)', value: step2Data?.penetracao },
    { title: 'Recuperação Elástica (%)', value: step2Data?.recuperacaoElastica },
    { title: 'Ponto de Amolecimento (°C)', value: step2Data?.pontoAmolecimento },
  ];

  // ==================== STEP 3 - LIGANTE ASFÁLTICO ====================
  const comerciaisFields = [
    { title: 'Referência Comercial', value: step3Data?.referenciaComercial },
    { title: 'Refinaria', value: step3Data?.refinaria },
    { title: 'Empresa Distribuidora', value: step3Data?.empresaDistribuidora },
    { title: 'Data do Carregamento', value: step3Data?.dataCarregamento },
    { title: 'Número da Nota Fiscal', value: step3Data?.numeroNotaFiscal },
    { title: 'Data da Nota Fiscal', value: step3Data?.dataNotaFiscal },
    { title: 'Número do Certificado', value: step3Data?.numeroCertificado },
    { title: 'Data do Certificado', value: step3Data?.dataCertificado },
  ];

  const originalFields = [
    { title: 'Tipo de CAP', value: step3Data?.tipoCAP },
    { title: 'Performance Grade (PG)', value: step3Data?.performanceGrade },
    { title: 'Penetração (mm) - 25°C', value: step3Data?.penetracao25 },
    { title: 'Ponto de Amolecimento (°C)', value: step3Data?.pontoAmolecimento },
    { title: 'Viscosidade Brookfield 135°C (cP)', value: step3Data?.viscosidadeBrookfield_135 },
    { title: 'Viscosidade Brookfield 150°C (cP)', value: step3Data?.viscosidadeBrookfield_150 },
    { title: 'Viscosidade Brookfield 177°C (cP)', value: step3Data?.viscosidadeBrookfield_177 },
    { title: 'Recuperação Elástica (%)', value: step3Data?.recuperacaoElastica },
  ];

  const dsrOriginalFields = [
    { title: 'DSR - G*/sen(δ) (MPa)', value: step3Data?.dsr_original_G_sen },
    { title: 'Temperatura do Teste (°C)', value: step3Data?.dsr_original_temp },
  ];

  const dsrRtfotFields = [
    { title: 'DSR RTFOT - G*/sen(δ) (MPa)', value: step3Data?.dsr_rtfot_G_sen },
    { title: 'Temperatura do Teste (°C)', value: step3Data?.dsr_rtfot_temp },
  ];

  const mscrFields = [
    { title: 'MSCR - Jnr 3,2 (1/kPa)', value: step3Data?.mscr_Jnr_3_2 },
    { title: 'MSCR - Jndiff (%)', value: step3Data?.mscr_Jndiff },
  ];

  const lasFields = [
    { title: 'LAS - Strain 1,25% - Nº', value: step3Data?.las_strain_1_25 },
    { title: 'LAS - Strain 2,5% - Nº', value: step3Data?.las_strain_2_5 },
    { title: 'LAS - Strain 5% - Nº', value: step3Data?.las_strain_5 },
    { title: 'LAS - af (comprimento na trinca)', value: step3Data?.las_af },
    { title: 'LAS - FFL (Fator de fadiga)', value: step3Data?.las_FFL },
    { title: 'LAS - D³', value: step3Data?.las_D },
  ];

  const bbrFields = [
    { title: 'BBR - Módulo de rigidez S (MPa)', value: step3Data?.bbr_S },
    { title: 'BBR - Coeficiente angular m (MPa)', value: step3Data?.bbr_m },
    { title: 'Temperatura do Teste (°C)', value: step3Data?.bbr_temp },
  ];

  // ==================== STEP 4 - CONCRETO ASFÁLTICO ====================
  const geraisFields = [
    { title: 'Tipo de CAP', value: step4Data?.tipoCAP },
    { title: 'Massa Específica (g/cm³)', value: step4Data?.massaEspecifica },
    { title: 'Resistência à Tração (MPa)', value: step4Data?.resistenciaTracao },
    { title: 'Teor de Asfalto (%)', value: step4Data?.teorAsfalto },
    { title: 'Volume de Vazios (%)', value: step4Data?.volumeVazios },
    { title: 'Faixa Granulométrica', value: step4Data?.faixaGranulometrica },
    { title: 'TMN (mm)', value: step4Data?.tmn },
    { title: 'Abrasão Los Angeles (%)', value: step4Data?.abrasaoLosAngeles },
    { title: 'Flow Number (FN)', value: step4Data?.flowNumber },
    { title: 'Módulo de Resiliência 25°C (MPa)', value: step4Data?.moduloResiliencia },
  ];

  const curvaFadigaFields = [
    { title: 'Nº de Amostras (CPs)', value: step4Data?.curvaFadiga_n_cps },
    { title: 'Coeficiente de Regressão (k1)', value: step4Data?.curvaFadiga_k1 },
    { title: 'Coeficiente de Regressão (k2)', value: step4Data?.curvaFadiga_k2 },
    { title: 'Coef. de Determinação (R²)', value: step4Data?.curvaFadiga_r2 },
  ];

  const sigmoidalFields = [
    { title: 'Coeficiente a', value: step4Data?.sigmoidal_a },
    { title: 'Coeficiente b', value: step4Data?.sigmoidal_b },
    { title: 'Coeficiente d', value: step4Data?.sigmoidal_d },
    { title: 'Coeficiente g', value: step4Data?.sigmoidal_g },
    { title: 'Coeficiente a1', value: step4Data?.sigmoidal_a1 },
    { title: 'Coeficiente a2', value: step4Data?.sigmoidal_a2 },
    { title: 'Coeficiente a3', value: step4Data?.sigmoidal_a3 },
  ];

  const danoFields = [
    { title: 'Parâmetro "α" de evolução do dano', value: step4Data?.parametro_alfa },
    { title: 'C₁₀', value: step4Data?.dano_C10 },
    { title: 'C₁₁', value: step4Data?.dano_C11 },
    { title: 'C₁₂', value: step4Data?.dano_C12 },
    { title: 'a', value: step4Data?.dano_a },
    { title: 'b', value: step4Data?.dano_b },
    { title: 'Y', value: step4Data?.dano_Y },
    { title: 'Δ', value: step4Data?.dano_Delta },
  ];

  const shiftModelFields = [
    { title: 'Nº de Amostras (CPs)', value: step4Data?.shiftModel_n_cps },
    { title: 'ε₀', value: step4Data?.shiftModel_ε0 },
    { title: 'N1', value: step4Data?.shiftModel_N1 },
    { title: 'β', value: step4Data?.shiftModel_β },
    { title: 'p1', value: step4Data?.shiftModel_p1 },
    { title: 'p2', value: step4Data?.shiftModel_p2 },
    { title: 'd1', value: step4Data?.shiftModel_d1 },
    { title: 'd2', value: step4Data?.shiftModel_d2 },
  ];

  const sections = [
    'step2-tratamento',
    'step2-emulsao',
    'step2-parametros',
    'step3-comerciais',
    'step3-original',
    'step3-dsr-original',
    'step3-rtfot',
    'step3-mscr',
    'step3-las',
    'step3-bbr',
    'step4-gerais',
    'step4-fadiga',
    'step4-sigmoidal',
    'step4-dano',
    'step4-prony',
    'step4-shift',
  ];

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

          {/* STEP 2 - TRATAMENTO SUPERFICIAL */}
          <Box id="step2-tratamento" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="TRATAMENTO SUPERFICIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-evenly',
                }}
              >
                {tratamentoFields.map((item, idx) => (
                  item.value && (
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}
                      key={idx}
                    >
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step2-emulsao" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="EMULSÃO ASFÁLTICA" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {emulsaoFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step2-parametros" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PARÂMETROS DO MATERIAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {parametrosFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* STEP 3 - LIGANTE ASFÁLTICO */}
          <Box id="step3-comerciais" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DADOS COMERCIAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {comerciaisFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-original" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {originalFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-dsr-original" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="DSR - LIGANTE ORIGINAL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {dsrOriginalFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-rtfot" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LIGANTE ENVELHECIDO RTFOT" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {dsrRtfotFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-mscr" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="MSCR" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {mscrFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-las" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="LAS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {lasFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step3-bbr" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="BBR (RTFOT + PAV)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {bbrFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* STEP 4 - CONCRETO ASFÁLTICO */}
          <Box id="step4-gerais" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="PROPRIEDADES GERAIS" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {geraisFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-fadiga" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVA DE FADIGA (COMPRESSÃO DIAMETRAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {curvaFadigaFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-sigmoidal" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="CURVAS-MESTRAS (FUNÇÃO SIGMOIDAL)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {sigmoidalFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-dano" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO (G²)" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {danoFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-prony" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
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
                {step4Data?.einf && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Einf (kPa)</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{step4Data.einf}</Typography>
                  </Box>
                )}
                {(step4Data?.prony_pi || []).map((pi, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>pi (s) - {index + 1}</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{pi}</Typography>
                    <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>Ei (kPa)</Typography>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>{step4Data?.prony_Ei?.[index]}</Typography>
                  </Box>
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          <Box id="step4-shift" sx={{ paddingTop: '1rem', paddingX: '6rem' }}>
            <FlexColumnBorder title="COEFICIENTES DE REGRESSÃO DO SHIFT MODEL" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { mobile: '1fr', tablet: '1fr 1fr', desktop: '1fr 1fr 1fr 1fr' },
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {shiftModelFields.map((item, idx) => (
                  item.value && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', textAlign: 'center' }} key={idx}>
                      <Typography sx={{ fontWeight: 'normal', fontSize: '14px', color: 'gray' }}>{item.title}</Typography>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                        {item.value === null || item.value === '' ? '-' : item.value}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </FlexColumnBorder>
          </Box>

          {/* OBSERVAÇÕES */}
          {(step2Data?.observacoes || step3Data?.observacoes || step4Data?.observacoes) && (
            <Box id="observacoes" sx={{ paddingTop: '1rem', paddingX: '6rem', paddingBottom: '2rem' }}>
              <FlexColumnBorder title="OBSERVAÇÕES" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    justifyItems: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {step2Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      Tratamento Superficial: {step2Data.observacoes}
                    </Typography>
                  )}
                  {step3Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      Ligante Asfáltico: {step3Data.observacoes}
                    </Typography>
                  )}
                  {step4Data?.observacoes && (
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
                      Concreto Asfáltico: {step4Data.observacoes}
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