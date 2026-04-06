/* eslint-disable @typescript-eslint/no-explicit-any */
import { EssayPageProps } from '../../../templates/essay';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import useGranularLayersStore from '@/stores/promedina/granular-layers/granular-layers.store';
import FlexColumnBorder from '@/components/atoms/containers/flex-column-with-border';
import { toast } from 'react-toastify';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import UploadImages from '@/components/molecules/uploadImages';
import { useEffect, useState } from 'react';
import { dateFormatter } from '@/utils/dateFormatter';
import EditableCell from '@/utils/hooks/editableTableCell';

const GranularLayers_step2 = ({ setNextDisabled }: EssayPageProps) => {
const { step2Data, setData } = useGranularLayersStore();
const rows = step2Data?.structuralComposition || [];
const [images, setImages] = useState<string>(step2Data?.images ? step2Data?.images : '');

useEffect(() => {
if (images !== null) {
setData({ step: 1, key: 'images', value: images });
}
}, [images, setData]);

useEffect(() => {
if (step2Data?.images !== null) {
setImages(step2Data?.images);
}
}, [step2Data?.images]);

// REMOVER MAIS UMA LINHA DE DETERMINADO VALOR
const handleErase = () => {
try {
if (rows.length > 1) {
const newRows = [...rows];
newRows.pop();
setData({ step: 1, key: 'structuralComposition', value: newRows });
} else throw new Error("Valor mínimo atingido");
} catch (error) {
toast.error(error as string);
}
};

// ADICIONAR MAIS UMA LINHA DE DETERMINADO VALOR
const handleAdd = () => {
const newRows = [...rows];
newRows.push({
id: rows.length,
layer: null,
material: null,
thickness: null,
});
setData({ step: 1, key: 'structuralComposition', value: newRows });
setNextDisabled(true);
};

const ExpansionToolbar = () => {
return (
<Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem', flexWrap: 'wrap' }}>
<Button sx={{ color: 'secondaryTons.red' }} onClick={handleErase}>
REMOVER
</Button>
<Button sx={{ color: 'secondaryTons.green' }} onClick={handleAdd}>
ADICIONAR
</Button>
</Box>
);
};

// OPÇÕES PARA TIPO DE SEÇÃO
const tipoSecaoOptions = [
{ value: 'Experimental', label: 'Experimental' },
{ value: 'Controle', label: 'Controle' },
{ value: 'Referência', label: 'Referência' },
];

// OPÇÕES PARA ESTRUTURA
const estruturaOptions = [
{ value: 'Flexível', label: 'Flexível' },
{ value: 'Semi-rígida', label: 'Semi-rígida' },
{ value: 'Rígida', label: 'Rígida' },
];

// OPÇÕES PARA FONTE DE MONITORAMENTO
const fonteMonitoramentoOptions = [
{ value: 'DNIT', label: 'DNIT' },
{ value: 'Concessionária', label: 'Concessionária' },
{ value: 'Universidade', label: 'Universidade' },
{ value: 'Consultoria', label: 'Consultoria' },
];

// DADOS DO PAVIMENTO
const inputsPavimentData = [
{
label: 'IDENTIFICAÇÃO',
value: step2Data?.identification,
key: 'identification',
required: true,
type: 'text',
},
{
label: 'TIPO DE SEÇÃO',
value: step2Data?.tipoSecao,
key: 'tipoSecao',
required: true,
type: 'select',
options: tipoSecaoOptions,
},
{
label: 'ESTRUTURA',
value: step2Data?.estrutura,
key: 'estrutura',
required: true,
type: 'select',
options: estruturaOptions,
},
{
label: 'MATERIAL',
value: step2Data?.material,
key: 'material',
required: true,
type: 'text',
},
{
label: 'LONGITUDE',
value: step2Data?.longitude,
key: 'longitude',
required: true,
type: 'text',
},
{
label: 'LATITUDE',
value: step2Data?.latitude,
key: 'latitude',
required: true,
type: 'text',
},
{
label: 'ALTITUDE',
value: step2Data?.altitude,
key: 'altitude',
required: true,
type: 'number',
},
{
label: 'FONTE DE MONITORAMENTO',
value: step2Data?.fonteMonitoramento,
key: 'fonteMonitoramento',
required: true,
type: 'select',
options: fonteMonitoramentoOptions,
},
{
label: 'LONGITUDE FORA',
value: step2Data?.longitudeFora,
key: 'longitudeFora',
required: false,
type: 'text',
},
{
label: 'LATITUDE FORA',
value: step2Data?.latitudeFora,
key: 'latitudeFora',
required: false,
type: 'text',
},
];

// PREPARO DO PAVIMENTO
const inputsPavimentPreparation = [
{ 
label: 'PREGOEIRO', 
value: step2Data?.pregoeiro, 
key: 'pregoeiro', 
required: true,
type: 'text',
},
{
label: 'INFORMAÇÃO BASE',
value: step2Data?.informacaoBase,
key: 'informacaoBase',
required: true,
type: 'text',
},
{
label: 'PONTO DE LIGAÇÃO',
value: step2Data?.pontoLigacao,
key: 'pontoLigacao',
required: true,
type: 'text',
},
{
label: 'ÚLTIMA ATUALIZAÇÃO',
value: step2Data?.ultimaAtualizacao,
key: 'ultimaAtualizacao',
required: true,
type: 'date',
},
];

// CARACTERÍSTICAS DA VIA
const inputsCaracteristicasVia = [
{
label: 'LOCAL',
value: step2Data?.local,
key: 'local',
required: true,
type: 'text',
},
{
label: 'MUNICÍPIO/ESTADO',
value: step2Data?.municipioEstado,
key: 'municipioEstado',
required: true,
type: 'text',
},
{
label: 'EXTENSÃO',
value: step2Data?.extensao,
key: 'extensao',
required: true,
type: 'number',
},
{
label: 'VELOCIDADE DIRETA DA VIA',
value: step2Data?.velocidadeDiretaVia,
key: 'velocidadeDiretaVia',
required: true,
type: 'number',
},
{
label: 'LARGURA DA FAIXA',
value: step2Data?.larguraFaixa,
key: 'larguraFaixa',
required: true,
type: 'number',
},
];

// COORDENADAS
const inputsCoordenadas = [
{
label: 'INÍCIO ESTACA',
value: step2Data?.inicioEstaca,
key: 'inicioEstaca',
required: true,
type: 'text',
},
{
label: 'INÍCIO LATITUDE',
value: step2Data?.inicioLatitude,
key: 'inicioLatitude',
required: true,
type: 'text',
},
{
label: 'FIM METROS',
value: step2Data?.fimMetros,
key: 'fimMetros',
required: true,
type: 'text',
},
{
label: 'FIM LONGITUDE',
value: step2Data?.fimLongitude,
key: 'fimLongitude',
required: true,
type: 'text',
},
{
label: 'ALTITUDE MÉDIA',
value: step2Data?.altitudeMedia,
key: 'altitudeMedia',
required: true,
type: 'number',
},
];

const columns: GridColDef[] = [
{
field: 'layer',
headerName: 'CAMADA',
flex: 1,
minWidth: 200,
renderCell: ({ row }) => {
return <EditableCell row={row} field="layer" rows={rows} setData={setData} adornment={''} />;
},
},
{
field: 'material',
headerName: 'MATERIAL',
flex: 1,
minWidth: 200,
renderCell: ({ row }) => {
return <EditableCell row={row} field="material" rows={rows} setData={setData} adornment={''} />;
},
},
{
field: 'thickness',
headerName: 'ESPESSURA',
flex: 1,
minWidth: 200,
renderCell: ({ row }) => {
return <EditableCell row={row} field="thickness" rows={rows} setData={setData} adornment={'mm'} />;
},
},
];

const renderField = (input: any) => {
if (input.type === 'select') {
return (
<FormControl variant="standard" fullWidth required={input.required} key={input.key}>
<InputLabel>{input.label}</InputLabel>
<Select
value={input.value || ''}
label={input.label}
onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
>
{input.options.map((option: any) => (
<MenuItem key={option.value} value={option.value}>
{option.label}
</MenuItem>
))}
</Select>
</FormControl>
);
}

if (input.type === 'date') {
return (
<TextField
key={input.key}
variant="standard"
type="date"
label={input.label}
value={input.value || ''}
required={input.required}
InputLabelProps={{ shrink: true }}
onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
/>
);
}

if (input.type === 'number') {
let adornment = '';
if (input.key === 'extensao' || input.key === 'altitude' || input.key === 'altitudeMedia') {
adornment = 'm';
} else if (input.key === 'velocidadeDiretaVia') {
adornment = 'km/h';
} else if (input.key === 'larguraFaixa') {
adornment = 'm';
}
return (
<InputEndAdornment
key={input.key}
adornment={adornment}
type="number"
variant="standard"
label={input.label}
value={input.value?.toString() || ''}
required={input.required}
onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
/>
);
}

return (
<TextField
key={input.key}
variant="standard"
type={input.type}
multiline={input.key === 'observation'}
sx={input.key === 'observations' && { width: '100%' }}
label={input.label}
value={input.value || ''}
required={input.required}
onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
/>
);
};

// DESABILITA O BOTÃO PRÓXIMO (AJUSTE CONFORME NECESSIDADE)
setNextDisabled(false);

return (
<>
{/* DADOS DO PAVIMENTO */}
<FlexColumnBorder title="DADOS DO PAVIMENTO" open={true} theme={'#07B811'} sx_title={{ whiteSpace: 'wrap' }}>
<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '10px 20px', paddingBottom: '20px' }}>
{inputsPavimentData.map((input) => renderField(input))}
</Box>
</Box>
</FlexColumnBorder>

{/* PREPARO DO PAVIMENTO */}
<FlexColumnBorder title="PREPARO DO PAVIMENTO" open={true} theme={'#07B811'}>
<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '5px 20px', paddingBottom: '20px' }}>
{inputsPavimentPreparation.map((input) => renderField(input))}
</Box>
</Box>
</FlexColumnBorder>

{/* CARACTERÍSTICAS DA VIA */}
<FlexColumnBorder title="CARACTERÍSTICAS DA VIA" open={true} theme={'#07B811'}>
<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '5px 20px', paddingBottom: '20px' }}>
{inputsCaracteristicasVia.map((input) => renderField(input))}
</Box>
</Box>
</FlexColumnBorder>

{/* COORDENADAS */}
<FlexColumnBorder title="COORDENADAS" open={true} theme={'#07B811'}>
<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
<Box sx={{ display: 'grid', width: '100%', gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr' }, gap: '5px 20px', paddingBottom: '20px' }}>
{inputsCoordenadas.map((input) => renderField(input))}
</Box>
</Box>
</FlexColumnBorder>

{/* COMPOSIÇÃO ESTRUTURAL */}
<FlexColumnBorder title="COMPOSIÇÃO ESTRUTURAL" open={true} theme={'#07B811'}>
{rows?.length > 0 && columns?.length > 0 && (
<DataGrid
sx={{ mt: '1rem', borderRadius: '10px' }}
density="compact"
showCellVerticalBorder
showColumnVerticalBorder
slots={{ footer: ExpansionToolbar }}
rows={rows?.map((row, index) => ({ ...row, id: index }))}
columns={columns.map((column) => ({
...column,
sortable: false,
disableColumnMenu: true,
align: 'center',
headerAlign: 'center',
}))}
/>
)}

<Box id="upload-images" sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', paddingBottom: '20px' }}>
<UploadImages editarImages={step2Data?.images} onImagesUpdate={(images: string) => setImages(images)} />
<TextField
variant="standard"
sx={{ width: 'fit-content', marginX: 'auto' }}
type="string"
label="DATA DA IMAGEM"
placeholder="_ _/_ _/_ _ _ _"
value={dateFormatter(step2Data?.imagesDate)}
style={{ display: 'block' }}
required={false}
onChange={(e) => setData({ step: 1, key: 'imagesDate', value: e.target.value })}
/>
</Box>
</FlexColumnBorder>
</>
);
};

export default GranularLayers_step2;