/* eslint-disable react/no-unescaped-entities */
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Result_CardContainer } from '@/components/atoms/containers/result-card';
import { Box, Typography } from '@mui/material';
import { t } from 'i18next';

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

const SampleDataVisualization = ({
  name,
  zone,
  layer,
  cityState,
  observations,
  identification,
  sectionType,
  extension,
  initialStakeMeters,
  latitudeI,
  longitudeI,
  finalStakeMeters,
  latitudeF,
  longitudeF,
  monitoringPhase,
  observation,
  milling,
  interventionAtTheBase,
  sami,
  bondingPaint,
  priming,
  images,
  imagesDate,
  structuralComposition,
  mctGroup,
  mctCoefficientC,
  mctIndexE,
  especificMass,
  compressionEnergy,
  granulometricRange,
  optimalHumidity,
  abrasionLA,
  k1,
  k2,
  k3,
  k4,
  k1psi1,
  k2psi2,
  k3psi3,
  k4psi4,
  stabilizer,
  tenor,
  rtcd,
  rtf,
  rcs,
  rsInitial,
  rsFinal,
  constantA,
  constantB,
  fatiguek1psi1,
  fatiguek2psi2,
  refinery,
  company,
  collectionDate,
  invoiceNumber,
  dataInvoice,
  certificateDate,
  capType,
  performanceGrade,
  penetration,
  softeningPoint,
  elasticRecovery,
  vb_sp21_20,
  vb_sp21_50,
  vb_sp21_100,
  tmn,
  asphaltTenor,
  specificMass,
  volumeVoids,
  rt,
  flowNumber,
  mr,
  fatigueCurve_n_cps,
  fatigueCurve_k1,
  fatigueCurve_k2,
  fatigueCurve_r2,
}: ISampleData) => {
  const GeneralData = [
    {
      label: 'Nome',
      value: name,
    },
    {
      label: 'Zona',
      value: zone,
    },
    {
      label: 'Camada',
      value: layer,
    },
    {
      label: 'Cidade/Estado',
      value: cityState,
    },
    {
      label: 'Observações',
      value: observations,
    },
  ];

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
          {identification && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Identificação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{identification}</Typography>
            </>
          )}
          {sectionType && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo de seção</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{sectionType}</Typography>
            </>
          )}
          {extension && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Extensão</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{extension}</Typography>
            </>
          )}
          {initialStakeMeters && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{initialStakeMeters}</Typography>
            </>
          )}
          {latitudeI && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{latitudeI}</Typography>
            </>
          )}
          {longitudeI && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{longitudeI}</Typography>
            </>
          )}
          {finalStakeMeters && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros final</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{finalStakeMeters}</Typography>
            </>
          )}
          {latitudeF && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{latitudeF}</Typography>
            </>
          )}
          {longitudeF && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{longitudeF}</Typography>
            </>
          )}
          {monitoringPhase && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fase de monitoramento</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{monitoringPhase}</Typography>
            </>
          )}
          {observation && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Observação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{observation}</Typography>
            </>
          )}
          {milling && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fresagem</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{milling}</Typography>
            </>
          )}
          {interventionAtTheBase && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Intervenção na base</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{interventionAtTheBase}</Typography>
            </>
          )}
          {sami && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>SAMI</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{sami}</Typography>
            </>
          )}
          {bondingPaint && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Pintura de ligação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{bondingPaint}</Typography>
            </>
          )}
          {priming && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Imprimação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{priming}</Typography>
            </>
          )}
          {mctGroup && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Grupo MCT</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{mctGroup}</Typography>
            </>
          )}
          {mctCoefficientC && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{mctCoefficientC}</Typography>
            </>
          )}
          {mctCoefficientC && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{mctCoefficientC}</Typography>
            </>
          )}
          {mctIndexE && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Índice e'</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{mctIndexE}</Typography>
            </>
          )}
          {especificMass && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{especificMass}</Typography>
            </>
          )}
          {compressionEnergy && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Energia de compactação</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{compressionEnergy}</Typography>
            </>
          )}
          {granulometricRange && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Faixa granulométrica</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{granulometricRange}</Typography>
            </>
          )}
          {optimalHumidity && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Umidade ótima (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{optimalHumidity}</Typography>
            </>
          )}
          {abrasionLA && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Abrasão Los Angeles (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{abrasionLA}</Typography>
            </>
          )}
          {k1 && k2 && k3 && k4 && (
            <Result_CardContainer hideBorder title={'Módulo de Resiliência (MPa)'}>
              {k1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k1}</Typography>
                </>
              )}
              {k2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k2}</Typography>
                </>
              )}
              {k3 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k3}</Typography>
                </>
              )}
              {k4 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k4}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {k1psi1 && k2psi2 && k3psi3 && k4psi4 && (
            <Result_CardContainer hideBorder title={'Deformação Permanente'}>
              {k1psi1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k1psi1}</Typography>
                </>
              )}
              {k2psi2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k2psi2}</Typography>
                </>
              )}
              {k3psi3 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3 ou psi3</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k3psi3}</Typography>
                </>
              )}
              {k4psi4 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4 ou psi4</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{k4psi4}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {stabilizer && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estabilizante</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{stabilizer}</Typography>
            </>
          )}
          {tenor && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{tenor}</Typography>
            </>
          )}
          {rtcd && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTCD, 28 dias (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{rtcd}</Typography>
            </>
          )}
          {rtf && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTF, 28 dias (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{rtf}</Typography>
            </>
          )}
          {rcs && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RCS, 28 dias (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{rcs}</Typography>
            </>
          )}
          {rsInitial && rsFinal && constantA && constantB && (
            <Result_CardContainer hideBorder title={'Módulo de Resiliência, 28 dias (MPa)'}>
              {rsInitial && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Inicial (Ei)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{rsInitial}</Typography>
                </>
              )}
              {rsFinal && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Final (Ef)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{rsFinal}</Typography>
                </>
              )}
              {constantA && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante A</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{constantA}</Typography>
                </>
              )}
              {constantB && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante B</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{constantB}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {fatiguek1psi1 && fatiguek2psi2 && (
            <Result_CardContainer hideBorder title={'Fadiga do Material, 28 dias'}>
              {fatiguek1psi1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{fatiguek1psi1}</Typography>
                </>
              )}
              {fatiguek2psi2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{fatiguek2psi2}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {refinery && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Refinaria</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{refinery}</Typography>
            </>
          )}
          {company && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Empresa</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{company}</Typography>
            </>
          )}
          {collectionDate && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data de carregamento</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{collectionDate}</Typography>
            </>
          )}
          {certificateDate && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{certificateDate}</Typography>
            </>
          )}
          {certificateDate && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{certificateDate}</Typography>
            </>
          )}
          {invoiceNumber && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Nº da nota fiscal</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{invoiceNumber}</Typography>
            </>
          )}
          {dataInvoice && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data da nota fiscal</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{dataInvoice}</Typography>
            </>
          )}
          {capType && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo do CAP</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{capType}</Typography>
            </>
          )}
          {performanceGrade && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Performace grade (PG)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{performanceGrade}</Typography>
            </>
          )}
          {penetration && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Penetração, 25°C (mm)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{penetration}</Typography>
            </>
          )}
          {softeningPoint && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ponto de amolecimento (°C)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{softeningPoint}</Typography>
            </>
          )}
          {elasticRecovery && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Recuperação elástica, 25°C (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{elasticRecovery}</Typography>
            </>
          )}
          {vb_sp21_20 && vb_sp21_50 && vb_sp21_100 && (
            <Result_CardContainer hideBorder title={'Viscosidade Brookfield'}>
              {vb_sp21_20 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>135°C (SP21, 20rpm)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{vb_sp21_20}</Typography>
                </>
              )}
              {vb_sp21_50 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>150°C (SP21, 50rpm)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{vb_sp21_50}</Typography>
                </>
              )}
              {vb_sp21_100 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>177°C (SP21, 100rpm)</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{vb_sp21_100}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {tmn && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>TMN (mm)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{tmn}</Typography>
            </>
          )}
          {asphaltTenor && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor de asfalto (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{asphaltTenor}</Typography>
            </>
          )}
          {specificMass && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{specificMass}</Typography>
            </>
          )}
          {volumeVoids && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Volume de vazios (%)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{volumeVoids}</Typography>
            </>
          )}
          {rt && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RT (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{rt}</Typography>
            </>
          )}
          {flowNumber && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Flow number (FN)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{flowNumber}</Typography>
            </>
          )}
          {mr && (
            <>
              <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MR, 25°C (MPa)</Typography>
              <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{mr}</Typography>
            </>
          )}
          {fatigueCurve_n_cps && fatigueCurve_k1 && fatigueCurve_k2 && fatigueCurve_r2 && (
            <Result_CardContainer hideBorder title={'Curva de Fadiga à Compressão Diametral'}>
              {fatigueCurve_n_cps && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>N° CPs</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{fatigueCurve_n_cps}</Typography>
                </>
              )}
              {fatigueCurve_k1 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{fatigueCurve_k1}</Typography>
                </>
              )}
              {fatigueCurve_k2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{fatigueCurve_k2}</Typography>
                </>
              )}
              {fatigueCurve_r2 && (
                <>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>R²</Typography>
                  <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{fatigueCurve_r2}</Typography>
                </>
              )}
            </Result_CardContainer>
          )}
          {structuralComposition}
          {images}
          {imagesDate}
        </Box>
      </FlexColumnBorder>
    </>
  );
};

export default SampleDataVisualization;
