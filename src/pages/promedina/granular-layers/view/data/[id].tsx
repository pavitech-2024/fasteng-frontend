/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import samplesService from '@/services/promedina/granular-layers/granular-layers-view.service';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { Result_CardContainer } from '@/components/atoms/containers/result-card';
import { Box, Typography } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SpecificSample_GranularLayers = () => {
  const [samples, setSamples] = useState<any>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const query = router.query as any;
  console.log('🚀 ~ file: [id].tsx:12 ~ SpecificSample ~ id:', query.id);

  useEffect(() => {
    console.log('🚀 ~ file: [id].tsx:17 ~ SpecificSample ~ samples:', samples);
  }, [samples]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await samplesService.getSample(query.id);
        setSamples(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load samples:', error);
      }
    };

    fetchData();
  }, [query.id]);

  const GeneralData = [
    {
      label: 'Nome',
      value: samples?.generalData.name,
    },
    {
      label: 'Zona',
      value: samples?.generalData.zone,
    },
    {
      label: 'Camada',
      value: samples?.generalData.layer,
    },
    {
      label: 'Cidade/Estado',
      value: samples?.generalData.cityState,
    },
    {
      label: 'Observações',
      value: samples?.generalData.observations,
    },
  ];

  const columns: GridColDef[] = [
    { field: 'layer', headerName: 'Camada' },
    { field: 'material', headerName: 'Material' },
    { field: 'thickness', headerName: 'Espessura' },
  ];
  console.log("🚀 ~ file: [id].tsx:65 ~ columns:", columns)
  
  const rows = samples?.step2Data.structuralComposition.map((item, index) => ({
    id: index,
    layer: item.layer,
    material: item.material,
    thickness: item.thickness
  }));
  
  return (
    //  <div>teste</div>
    <div>
       <FlexColumnBorder title={t('pm.generalData')} open={true} theme={'#07B811'}>
         {GeneralData.map((item, index) => (
           <Box key={index} sx={{ display: 'grid', gridColumn: '1fr 1fr 1fr', alignItems: 'center' }}>
             <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>{item.label}</Typography>
             <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{item.value}</Typography>
           </Box>
         ))}
       </FlexColumnBorder>
       <FlexColumnBorder title={t('pm.dataSheet')} open={true} theme={'#07B811'}>
         <Box sx={{ display: 'grid', gridColumn: '1fr 1fr 1fr', alignItems: 'center' }}>
           {samples?.step2Data.identification && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Identificação</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.identification}</Typography>
             </>
           )}
           {samples?.step2Data.sectionType && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo de seção</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.sectionType}</Typography>
             </>
           )}
           {samples?.step2Data.extension && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Extensão</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.extension}</Typography>
             </>
           )}
           {samples?.step2Data.initialStakeMeters && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros inicial</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.initialStakeMeters}</Typography>
             </>
           )}
           {samples?.step2Data.latitudeI && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.latitudeI}</Typography>
             </>
           )}
           {samples?.step2Data.longitudeI && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.longitudeI}</Typography>
             </>
           )}
           {samples?.step2Data.finalStakeMeters && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estaca/Metros final</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.finalStakeMeters}</Typography>
             </>
           )}
           {samples?.step2Data.latitudeF && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Latitude inicial</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.latitudeF}</Typography>
             </>
           )}
           {samples?.step2Data.longitudeF && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Longitude inicial</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.longitudeF}</Typography>
             </>
           )}
           {samples?.step2Data.monitoringPhase && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fase de monitoramento</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.monitoringPhase}</Typography>
             </>
           )}
           {samples?.step2Data.observation && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Observação</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.observation}</Typography>
             </>
           )}
           {samples?.step2Data.milling && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Fresagem</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.milling}</Typography>
             </>
           )}
           {samples?.step2Data.interventionAtTheBase && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Intervenção na base</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.interventionAtTheBase}</Typography>
             </>
           )}
           {samples?.step2Data.sami && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>SAMI</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.sami}</Typography>
             </>
           )}
           {samples?.step2Data.bondingPaint && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Pintura de ligação</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.bondingPaint}</Typography>
             </>
           )}
           {samples?.step2Data.priming && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Imprimação</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step2Data.priming}</Typography>
             </>
           )}
           {samples?.step3Data.mctGroup && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Grupo MCT</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.mctGroup}</Typography>
             </>
           )}
           {samples?.step3Data.mctCoefficientC && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.mctCoefficientC}</Typography>
             </>
           )}
           {samples?.step3Data.mctCoefficientC && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Coeficiente c'</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.mctCoefficientC}</Typography>
             </>
           )}
           {samples?.step3Data.mctIndexE && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MCT-Índice e'</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.mctIndexE}</Typography>
             </>
           )}
           {samples?.step3Data.especificMass && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.especificMass}</Typography>
             </>
           )}
           {samples?.step3Data.compressionEnergy && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Energia de compactação</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.compressionEnergy}</Typography>
             </>
           )}
           {samples?.step3Data.granulometricRange && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Faixa granulométrica</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.granulometricRange}</Typography>
             </>
           )}
           {samples?.step3Data.optimalHumidity && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Umidade ótima (%)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.optimalHumidity}</Typography>
             </>
           )}
           {samples?.step3Data.abrasionLA && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Abrasão Los Angeles (%)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.abrasionLA}</Typography>
             </>
           )}
           {samples?.step3Data.k1 && samples?.step3Data.k2 && samples?.step3Data.k3 && samples?.step3Data.k4 && (
             <Result_CardContainer hideBorder title={'Módulo de Resiliência (MPa)'}>
               {samples?.step3Data.k1 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k1}</Typography>
                 </>
               )}
               {samples?.step3Data.k2 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k2}</Typography>
                 </>
               )}
               {samples?.step3Data.k3 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k3}</Typography>
                 </>
               )}
               {samples?.step3Data.k4 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k4}</Typography>
                 </>
               )}
             </Result_CardContainer>
           )}
           {samples?.step3Data.k1psi1 && samples?.step3Data.k2psi2 && samples?.step3Data.k3psi3 && samples?.step3Data.k4psi4 && (
             <Result_CardContainer hideBorder title={'Deformação Permanente'}>
               {samples?.step3Data.k1psi1 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k1psi1}</Typography>
                 </>
               )}
               {samples?.step3Data.k2psi2 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k2psi2}</Typography>
                 </>
               )}
               {samples?.step3Data.k3psi3 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k3 ou psi3</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k3psi3}</Typography>
                 </>
               )}
               {samples?.step3Data.k4psi4 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k4 ou psi4</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.step3Data.k4psi4}</Typography>
                 </>
               )}
             </Result_CardContainer>
           )}
           {samples?.stabilizer && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Estabilizante</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.stabilizer}</Typography>
             </>
           )}
           {samples?.tenor && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor (%)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.tenor}</Typography>
             </>
           )}
           {samples?.rtcd && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTCD, 28 dias (MPa)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rtcd}</Typography>
             </>
           )}
           {samples?.rtf && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RTF, 28 dias (MPa)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rtf}</Typography>
             </>
           )}
           {samples?.rcs && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RCS, 28 dias (MPa)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rcs}</Typography>
             </>
           )}
           {samples?.rsInitial && samples?.rsFinal && samples?.constantA && samples?.constantB && (
             <Result_CardContainer hideBorder title={'Módulo de Resiliência, 28 dias (MPa)'}>
               {samples?.rsInitial && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Inicial (Ei)</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rsInitial}</Typography>
                 </>
               )}
               {samples?.rsFinal && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Final (Ef)</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rsFinal}</Typography>
                 </>
               )}
               {samples?.constantA && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante A</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.constantA}</Typography>
                 </>
               )}
               {samples?.constantB && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Constante B</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.constantB}</Typography>
                 </>
               )}
             </Result_CardContainer>
           )}
           {samples?.fatiguek1psi1 && samples?.fatiguek2psi2 && (
             <Result_CardContainer hideBorder title={'Fadiga do Material, 28 dias'}>
               {samples?.fatiguek1psi1 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1 ou psi1</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatiguek1psi1}</Typography>
                 </>
               )}
               {samples?.fatiguek2psi2 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2 ou psi2</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatiguek2psi2}</Typography>
                 </>
               )}
             </Result_CardContainer>
           )}
           {samples?.refinery && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Refinaria</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.refinery}</Typography>
             </>
           )}
           {samples?.company && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Empresa</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.company}</Typography>
             </>
           )}
           {samples?.collectionDate && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data de carregamento</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.collectionDate}</Typography>
             </>
           )}
           {samples?.certificateDate && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.certificateDate}</Typography>
             </>
           )}
           {samples?.certificateDate && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data do certificado</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.certificateDate}</Typography>
             </>
           )}
           {samples?.invoiceNumber && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Nº da nota fiscal</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.invoiceNumber}</Typography>
             </>
           )}
           {samples?.dataInvoice && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Data da nota fiscal</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.ataInvoice}</Typography>
             </>
           )}
           {samples?.capType && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Tipo do CAP</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.capType}</Typography>
             </>
           )}
           {samples?.performanceGrade && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Performace grade (PG)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.performanceGrade}</Typography>
             </>
           )}
           {samples?.penetration && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Penetração, 25°C (mm)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.penetration}</Typography>
             </>
           )}
           {samples?.softeningPoint && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Ponto de amolecimento (°C)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.softeningPoint}</Typography>
             </>
           )}
           {samples?.elasticRecovery && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Recuperação elástica, 25°C (%)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.elasticRecovery}</Typography>
             </>
           )}
           {samples?.vb_sp21_20 && samples?.vb_sp21_50 && samples?.vb_sp21_100 && (
             <Result_CardContainer hideBorder title={'Viscosidade Brookfield'}>
               {samples?.vb_sp21_20 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>135°C (SP21, 20rpm)</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.vb_sp21_20}</Typography>
                 </>
               )}
               {samples?.vb_sp21_50 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>150°C (SP21, 50rpm)</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.vb_sp21_50}</Typography>
                 </>
               )}
               {samples?.vb_sp21_100 && (
                 <>
                   <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>177°C (SP21, 100rpm)</Typography>
                   <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.vb_sp21_100}</Typography>
                 </>
               )}
             </Result_CardContainer>
           )}
           {samples?.tmn && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>TMN (mm)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.tmn}</Typography>
             </>
           )}
           {samples?.sphaltTenor && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Teor de asfalto (%)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.asphaltTenor}</Typography>
             </>
           )}
           {samples?.specificMass && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Massa específica (g/cm³)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.specificMass}</Typography>
             </>
           )}
           {samples?.volumeVoids && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Volume de vazios (%)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.volumeVoids}</Typography>
             </>
           )}
           {samples?.rt && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>RT (MPa)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.rt}</Typography>
             </>
           )}
           {samples?.flowNumber && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>Flow number (FN)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.flowNumber}</Typography>
             </>
           )}
           {samples?.mr && (
             <>
               <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>MR, 25°C (MPa)</Typography>
               <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.mr}</Typography>
             </>
           )}
           {samples?.fatigueCurve_n_cps &&
             samples?.fatigueCurve_k1 &&
             samples?.fatigueCurve_k2 &&
             samples?.fatigueCurve_r2 && (
               <Result_CardContainer hideBorder title={'Curva de Fadiga à Compressão Diametral'}>
                 {samples?.samples?.fatigueCurve_n_cps && (
                   <>
                     <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>N° CPs</Typography>
                     <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>
                       {samples?.fatigueCurve_n_cps}
                     </Typography>
                   </>
                 )}
                 {samples?.fatigueCurve_k1 && (
                   <>
                     <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k1</Typography>
                     <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatigueCurve_k1}</Typography>
                   </>
                 )}
                 {samples?.fatigueCurve_k2 && (
                   <>
                     <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>k2</Typography>
                     <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatigueCurve_k2}</Typography>
                   </>
                 )}
                 {samples?.fatigueCurve_r2 && (
                   <>
                     <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>R²</Typography>
                     <Typography sx={{ fontWeight: 'light', fontSize: '12px' }}>{samples?.fatigueCurve_r2}</Typography>
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
                {rows !== undefined && (
                  <DataGrid 
                    rows={rows} 
                    columns={columns.map((column) => ({
                      ...column,
                      disableColumnMenu: true,
                      sortable: false,
                      align: 'center',
                      headerAlign: 'center',
                      minWidth: 100,
                      flex: 1,
                    }))} 
                    pageSizeOptions={[5, 10]}
                  />
                )}
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
                   {samples?.images}
                 </Box>
                 <Typography>{samples?.imagesDate}</Typography>
               </Box>
             </FlexColumnBorder>
           </Box>
         </FlexColumnBorder>
    </div>
  );
};

export default SpecificSample_GranularLayers;
