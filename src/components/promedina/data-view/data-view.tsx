/* eslint-disable react/no-unescaped-entities */
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Result_CardContainer } from '@/components/atoms/containers/result-card';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface ISampleData {
  name: string;
  zone: string;
  layer: string;
  cityState: string;
  observations?: string;
  // Paviment Data
  identification?: string;
  sectionType?: string;
  extension?: string;
  initialStakeMeters?: string;
  latitudeI?: string;
  longitudeI?: string;
  finalStakeMeters?: string;
  latitudeF?: string;
  longitudeF?: string;
  monitoringPhase?: string;
  observation?: string;
  // Paviment Preparation
  milling?: string;
  interventionAtTheBase?: string;
  sami?: string;
  bondingPaint?: string;
  priming?: string;
  images?: string[];
  imagesDate?: string;
  // Structural Composition
  structuralComposition?: {
    id: number;
    layer: unknown;
    material: unknown;
    thickness: unknown;
  }[];

  //GRANULAR LAYERS
  // Paviment Data
  mctGroup?: string;
  mctCoefficientC?: string;
  mctIndexE?: string;
  especificMass?: string;
  compressionEnergy?: string;
  granulometricRange?: string;
  optimalHumidity?: string;
  abrasionLA?: string;
  // Resilience module
  k1?: string;
  k2?: string;
  k3?: string;
  k4?: string;
  // Permanent deformation
  k1psi1?: string;
  k2psi2?: string;
  k3psi3?: string;
  k4psi4?: string;

  //STABILIZED LAYERS
  // Paviment Data
  stabilizer?: string;
  tenor?: string;
  rtcd?: string;
  rtf?: string;
  rcs?: string;
  // Resilience module
  rsInitial?: string;
  rsFinal?: string;
  constantA?: string;
  constantB?: string;
  // Material fadigue
  fatiguek1psi1?: string;
  fatiguek2psi2?: string;

  //BINDER ASPHALT CONCRETE
  // PavimentData
  refinery?: string; // Refinaria
  company?: string; // Empresa
  collectionDate?: string; // Data do carregamento
  invoiceNumber?: string; // Número da nota fiscal
  dataInvoice?: string; // Data da nota fiscal
  certificateDate?: string; // Data do certificado
  capType?: string; // Tipo de CAP
  performanceGrade?: string; // Performance grade (PG)
  penetration?: string; // Penetração - 25°C (mm)
  softeningPoint?: string; // Ponto de amolecimento (°C)
  elasticRecovery?: string; // Recuperação elástica - 25°C (%)
  // Viscosidade Brookfield
  vb_sp21_20?: string; // 135°C (SP21, 20rpm)
  vb_sp21_50?: string; // 150°C (SP21, 50rpm)
  vb_sp21_100?: string; // 177°C (SP21, 100rpm)
  tmn?: string;
  asphaltTenor?: string;
  specificMass?: string;
  volumeVoids?: string;
  rt?: string;
  flowNumber?: string;
  mr?: string;
  // Diametral Compression Fatigue Curve
  fatigueCurve_n_cps?: string;
  fatigueCurve_k1?: string;
  fatigueCurve_k2?: string;
  fatigueCurve_r2?: string;
}

// {
//   name,
//   zone,
//   layer,
//   cityState,
//   observations,
//   identification,
//   sectionType,
//   extension,
//   initialStakeMeters,
//   latitudeI,
//   longitudeI,
//   finalStakeMeters,
//   latitudeF,
//   longitudeF,
//   monitoringPhase,
//   observation,
//   milling,
//   interventionAtTheBase,
//   sami,
//   bondingPaint,
//   priming,
//   images,
//   imagesDate,
//   structuralComposition,
//   mctGroup,
//   mctCoefficientC,
//   mctIndexE,
//   especificMass,
//   compressionEnergy,
//   granulometricRange,
//   optimalHumidity,
//   abrasionLA,
//   k1,
//   k2,
//   k3,
//   k4,
//   k1psi1,
//   k2psi2,
//   k3psi3,
//   k4psi4,
//   stabilizer,
//   tenor,
//   rtcd,
//   rtf,
//   rcs,
//   rsInitial,
//   rsFinal,
//   constantA,
//   constantB,
//   fatiguek1psi1,
//   fatiguek2psi2,
//   refinery,
//   company,
//   collectionDate,
//   invoiceNumber,
//   dataInvoice,
//   certificateDate,
//   capType,
//   performanceGrade,
//   penetration,
//   softeningPoint,
//   elasticRecovery,
//   vb_sp21_20,
//   vb_sp21_50,
//   vb_sp21_100,
//   tmn,
//   asphaltTenor,
//   specificMass,
//   volumeVoids,
//   rt,
//   flowNumber,
//   mr,
//   fatigueCurve_n_cps,
//   fatigueCurve_k1,
//   fatigueCurve_k2,
//   fatigueCurve_r2,
// }: ISampleData

const SampleDataVisualization = ({ specificSample }: any) => {

  

  const GeneralData = [
    {
      label: 'Nome',
      value: specificSample.name,
    },
    {
      label: 'Zona',
      value: specificSample.zone,
    },
    {
      label: 'Camada',
      value: specificSample.layer,
    },
    {
      label: 'Cidade/Estado',
      value: specificSample.cityState,
    },
    {
      label: 'Observações',
      value: specificSample.observations,
    },
  ];
  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'Camada', width: 70 },
    { field: 'material', headerName: 'Material', width: 130 },
    { field: 'thickness', headerName: 'Espessura', width: 130 },
  ];

  const rows = specificSample.structuralComposition.map((item) => [
    { id: item.id, layer: item.layer },
    { id: item.id, material: item.material },
    { id: item.id, thickness: item.thickness },
  ]);
  return (
    <>
      <FlexColumnBorder title={t('pm.generalData')} open={true} theme={'#07B811'}>
        {GeneralData.map((item) => (
          <Box key={item.value} sx={{ display: 'grid', gridColumn: '1fr 1fr 1fr', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{item.label}</Typography>
            <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{item.value}</Typography>
          </Box>
        ))}
      </FlexColumnBorder>
      <FlexColumnBorder title={t('pm.dataSheet')} open={true} theme={'#07B811'}>
        <Box sx={{ display: 'grid', gridColumn: '1fr 1fr 1fr', alignItems: 'center' }}>
          {specificSample.identification && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Identificação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.identification}</Typography>
            </>
          )}
          {specificSample.sectionType && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo de seção</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.sectionType}</Typography>
            </>
          )}
          {specificSample.extension && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Extensão</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.extension}</Typography>
            </>
          )}
          {specificSample.initialStakeMeters && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                {specificSample.initialStakeMeters}
              </Typography>
            </>
          )}
          {specificSample.latitudeI && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.latitudeI}</Typography>
            </>
          )}
          {specificSample.longitudeI && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.longitudeI}</Typography>
            </>
          )}
          {specificSample.finalStakeMeters && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros final</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.finalStakeMeters}</Typography>
            </>
          )}
          {specificSample.latitudeF && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.latitudeF}</Typography>
            </>
          )}
          {specificSample.longitudeF && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.longitudeF}</Typography>
            </>
          )}
          {specificSample.monitoringPhase && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fase de monitoramento</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.monitoringPhase}</Typography>
            </>
          )}
          {specificSample.observation && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Observação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.observation}</Typography>
            </>
          )}
          {specificSample.milling && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fresagem</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.milling}</Typography>
            </>
          )}
          {specificSample.interventionAtTheBase && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Intervenção na base</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                {specificSample.interventionAtTheBase}
              </Typography>
            </>
          )}
          {specificSample.sami && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>SAMI</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.sami}</Typography>
            </>
          )}
          {specificSample.bondingPaint && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Pintura de ligação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.bondingPaint}</Typography>
            </>
          )}
          {specificSample.priming && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Imprimação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.priming}</Typography>
            </>
          )}
          {specificSample.mctGroup && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Grupo MCT</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.mctGroup}</Typography>
            </>
          )}
          {specificSample.mctCoefficientC && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.mctCoefficientC}</Typography>
            </>
          )}
          {specificSample.mctCoefficientC && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.mctCoefficientC}</Typography>
            </>
          )}
          {specificSample.mctIndexE && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Índice e'</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.mctIndexE}</Typography>
            </>
          )}
          {specificSample.especificMass && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.especificMass}</Typography>
            </>
          )}
          {specificSample.compressionEnergy && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Energia de compactação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.compressionEnergy}</Typography>
            </>
          )}
          {specificSample.granulometricRange && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Faixa granulométrica</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                {specificSample.granulometricRange}
              </Typography>
            </>
          )}
          {specificSample.optimalHumidity && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Umidade ótima (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.optimalHumidity}</Typography>
            </>
          )}
          {specificSample.abrasionLA && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Abrasão Los Angeles (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.abrasionLA}</Typography>
            </>
          )}
          {specificSample.k1 && specificSample.k2 && specificSample.k3 && specificSample.k4 && (
            <Result_CardContainer hideBorder title={'Módulo de Resiliência (MPa)'}>
              {specificSample.k1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k1}</Typography>
                </>
              )}
              {specificSample.k2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k2}</Typography>
                </>
              )}
              {specificSample.k3 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k3}</Typography>
                </>
              )}
              {specificSample.k4 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k4}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {specificSample.k1psi1 && specificSample.k2psi2 && specificSample.k3psi3 && specificSample.k4psi4 && (
            <Result_CardContainer hideBorder title={'Deformação Permanente'}>
              {specificSample.k1psi1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k1psi1}</Typography>
                </>
              )}
              {specificSample.k2psi2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k2psi2}</Typography>
                </>
              )}
              {specificSample.k3psi3 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3 ou psi3</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k3psi3}</Typography>
                </>
              )}
              {specificSample.k4psi4 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4 ou psi4</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.k4psi4}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {specificSample.stabilizer && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estabilizante</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.stabilizer}</Typography>
            </>
          )}
          {specificSample.tenor && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.tenor}</Typography>
            </>
          )}
          {specificSample.rtcd && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTCD, 28 dias (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.rtcd}</Typography>
            </>
          )}
          {specificSample.rtf && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTF, 28 dias (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.rtf}</Typography>
            </>
          )}
          {specificSample.rcs && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RCS, 28 dias (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.rcs}</Typography>
            </>
          )}
          {specificSample.rsInitial &&
            specificSample.rsFinal &&
            specificSample.constantA &&
            specificSample.constantB && (
              <Result_CardContainer hideBorder title={'Módulo de Resiliência, 28 dias (MPa)'}>
                {specificSample.rsInitial && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Inicial (Ei)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.rsInitial}</Typography>
                  </>
                )}
                {specificSample.rsFinal && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Final (Ef)</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.rsFinal}</Typography>
                  </>
                )}
                {specificSample.constantA && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante A</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.constantA}</Typography>
                  </>
                )}
                {specificSample.constantB && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante B</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.constantB}</Typography>
                  </>
                )}
              </Result_CardContainer>
            )}
          {specificSample.fatiguek1psi1 && specificSample.fatiguek2psi2 && (
            <Result_CardContainer hideBorder title={'Fadiga do Material, 28 dias'}>
              {specificSample.fatiguek1psi1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.fatiguek1psi1}</Typography>
                </>
              )}
              {specificSample.fatiguek2psi2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.fatiguek2psi2}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {specificSample.refinery && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Refinaria</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.refinery}</Typography>
            </>
          )}
          {specificSample.company && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Empresa</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.company}</Typography>
            </>
          )}
          {specificSample.collectionDate && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data de carregamento</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.collectionDate}</Typography>
            </>
          )}
          {specificSample.certificateDate && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.certificateDate}</Typography>
            </>
          )}
          {specificSample.certificateDate && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.certificateDate}</Typography>
            </>
          )}
          {specificSample.invoiceNumber && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Nº da nota fiscal</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.invoiceNumber}</Typography>
            </>
          )}
          {specificSample.dataInvoice && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data da nota fiscal</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.ataInvoice}</Typography>
            </>
          )}
          {specificSample.capType && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo do CAP</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.capType}</Typography>
            </>
          )}
          {specificSample.performanceGrade && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Performace grade (PG)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.performanceGrade}</Typography>
            </>
          )}
          {specificSample.penetration && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Penetração, 25°C (mm)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.penetration}</Typography>
            </>
          )}
          {specificSample.softeningPoint && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ponto de amolecimento (°C)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.softeningPoint}</Typography>
            </>
          )}
          {specificSample.elasticRecovery && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Recuperação elástica, 25°C (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.elasticRecovery}</Typography>
            </>
          )}
          {specificSample.vb_sp21_20 && specificSample.vb_sp21_50 && specificSample.vb_sp21_100 && (
            <Result_CardContainer hideBorder title={'Viscosidade Brookfield'}>
              {specificSample.vb_sp21_20 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>135°C (SP21, 20rpm)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.vb_sp21_20}</Typography>
                </>
              )}
              {specificSample.vb_sp21_50 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>150°C (SP21, 50rpm)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.vb_sp21_50}</Typography>
                </>
              )}
              {specificSample.vb_sp21_100 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>177°C (SP21, 100rpm)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.vb_sp21_100}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {specificSample.tmn && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>TMN (mm)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.tmn}</Typography>
            </>
          )}
          {specificSample.sphaltTenor && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor de asfalto (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.asphaltTenor}</Typography>
            </>
          )}
          {specificSample.specificMass && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.specificMass}</Typography>
            </>
          )}
          {specificSample.volumeVoids && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Volume de vazios (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.volumeVoids}</Typography>
            </>
          )}
          {specificSample.rt && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RT (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.rt}</Typography>
            </>
          )}
          {specificSample.flowNumber && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Flow number (FN)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.flowNumber}</Typography>
            </>
          )}
          {specificSample.mr && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MR, 25°C (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificSample.mr}</Typography>
            </>
          )}
          {specificSample.fatigueCurve_n_cps &&
            specificSample.fatigueCurve_k1 &&
            specificSample.fatigueCurve_k2 &&
            specificSample.fatigueCurve_r2 && (
              <Result_CardContainer hideBorder title={'Curva de Fadiga à Compressão Diametral'}>
                {specificSample.specificSample.fatigueCurve_n_cps && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>N° CPs</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {specificSample.fatigueCurve_n_cps}
                    </Typography>
                  </>
                )}
                {specificSample.fatigueCurve_k1 && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {specificSample.fatigueCurve_k1}
                    </Typography>
                  </>
                )}
                {specificSample.fatigueCurve_k2 && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {specificSample.fatigueCurve_k2}
                    </Typography>
                  </>
                )}
                {specificSample.fatigueCurve_r2 && (
                  <>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>R²</Typography>
                    <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                      {specificSample.fatigueCurve_r2}
                    </Typography>
                  </>
                )}
              </Result_CardContainer>
            )}
          <FlexColumnBorder title={t('pm.structural.composition')} open={true} theme={'#07B811'}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]} />
              </div>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold' }}>Imagem do Segmento Experimental</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { mobile: 'column', desktop: 'row' },
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                {specificSample.images}
              </Box>
              <Typography>{specificSample.imagesDate}</Typography>
            </Box>
          </FlexColumnBorder>
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default SampleDataVisualization;
