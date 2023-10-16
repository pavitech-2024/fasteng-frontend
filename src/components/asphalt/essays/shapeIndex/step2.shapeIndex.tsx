import DropDown from '@/components/atoms/inputs/dropDown';
import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useShapeIndexStore from '@/stores/asphalt/shapeIndex/shapeIndex.store';
import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { t } from 'i18next';
import ShapeIndex_step2_Circular_Sieve_Table from './tables/step2-circular-sieve-table.shapeIndex';
import ShapeIndex_step2_Sieve_Table from './tables/step2-sieve-table.shapeIndex';
import { AllSieves } from '@/interfaces/common';

const ShapeIndex_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
    const { step2Data: data, setData } = useShapeIndexStore();

    const methodOptions = [
        { label: t('shapeIndex.circular_sieve'), value: 'sieve' },
        { label: t('shapeIndex.pachymeter'), value: 'pachymeter' }
    ];

    const graduationOptions = ['A', 'B', 'C', 'D'];

    if (data.method && data.method == "sieve" && data.graduation && data.circular_sieves_table_data.length == 0) {
        const table_data = [];

        if (data.graduation === "A") {
            table_data.push({
                label: '76,0 - 63,5',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '63,5 - 50,0',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '50,0 - 38,0',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '38,0 - 32,0',
                sieve1: null,
                sieve2: null,
            });
        }
        
        if (data.graduation === "B") {
            table_data.push({
                label: '32,0 - 25,0',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '25,0 - 19,0',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '19,0 - 16,0',
                sieve1: null,
                sieve2: null,
            });
        }
        
        if (data.graduation === "C") {
            table_data.push({
                label: '19,0 - 16,0',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '16,0 - 12,7',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '12,7 - 9,5',
                sieve1: null,
                sieve2: null,
            });
        }

        if (data.graduation === "D") {
            table_data.push({
                label: '12,7 - 9,5',
                sieve1: null,
                sieve2: null,
            });
            table_data.push({
                label: '9,5 - 6,3',
                sieve1: null,
                sieve2: null,
            });
        }

        setData({ step: 1, key: 'circular_sieves_table_data', value: table_data });
    }

    if (data.method && data.method == "pachymeter" && data.sieves_table_data.length == 0) {
        const table_data = [];

        AllSieves.map((sieve) => {
            table_data.push({
                label: sieve.label,
                retained_mass: null,
                grains_count: '-',
            })
        })

        setData({ step: 1, key: 'sieves_table_data', value: table_data });
    }

    const circular_sieve_rows = data.circular_sieves_table_data;

    const circular_sieve_columns: GridColDef[] = [
        {
            field: 'label',
            headerName: t('shapeIndex.circular_sieves'),
            valueFormatter: ({ value }) => `${value}`,
        },
        {
            field: 'sieve1',
            headerName: t('shapeIndex.circular_sieve') + " 1",
            renderCell: ({ row }) => {
                const { label } = row;
                const label_index = circular_sieve_rows.findIndex((r) =>
                    r.label === label
                );

                return (
                    <InputEndAdornment
                        fullWidth
                        adornment=""
                        type="number"
                        inputProps={{ min: 0 }}
                        value={circular_sieve_rows[label_index].sieve1}
                        onChange={(e) => {
                            const newRows = [...circular_sieve_rows];
                            newRows[label_index].sieve1 = Number(e.target.value);
                            setData({ step: 1, key: 'circular_sieves_table_data', value: newRows });
                        }}
                    />
                );
            },
        },
        {
            field: 'sieve2',
            headerName: t('shapeIndex.circular_sieve') + " 2",
            renderCell: ({ row }) => {
                const { label } = row;
                const label_index = circular_sieve_rows.findIndex((r) =>
                    r.label === label
                );

                return (
                    <InputEndAdornment
                        fullWidth
                        adornment=""
                        type="number"
                        inputProps={{ min: 0 }}
                        value={circular_sieve_rows[label_index].sieve2}
                        onChange={(e) => {
                            const newRows = [...circular_sieve_rows];
                            newRows[label_index].sieve2 = Number(e.target.value);
                            setData({ step: 1, key: 'circular_sieves_table_data', value: newRows });
                        }}
                    />
                );
            },
        },
    ]

    const sieve_rows = data.sieves_table_data;

    const sieve_columns: GridColDef[] = [
        {
            field: 'label',
            headerName: t('shapeIndex.sieve'),
            valueFormatter: ({ value }) => `${value}`,
        },
        {
            field: 'retained_mass',
            headerName: t('shapeIndex.retained_mass'),
            renderCell: ({ row }) => {
                const { label } = row;
                const label_index = sieve_rows.findIndex((r) =>
                    r.label === label
                );

                return (
                    <InputEndAdornment
                        fullWidth
                        adornment="g"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={sieve_rows[label_index].retained_mass}
                        onChange={(e) => {
                            const newRows = [...sieve_rows];
                            newRows[label_index].retained_mass = Number(e.target.value);
                            setData({ step: 1, key: 'sieves_table_data', value: newRows });
                        }}
                    />
                );
            },
        },
        {
            field: 'grains_count',
            headerName: t('shapeIndex.grains_count'),
            valueFormatter: ({ value }) => `${value}`,
        },
    ]

    if (nextDisabled && data.total_mass) setNextDisabled(false);

    return (
        <Box>
            <Box
                key={'top'}
                sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
                    gap: '10px',
                    mt: '20px',
                }}
            >
                <DropDown
                    key={'essay_method'}
                    variant="standard"
                    label={t('shapeIndex.choose-method')}
                    options={methodOptions.map((method) => {
                        return { label: method.label, value: method.value }
                    })}
                    callback={(value) => {
                        setData({ step: 1, key: 'method', value });
                        setData({ step: 1, key: 'circular_sieves_table_data', value: [] });
                        setData({ step: 1, key: 'sieves_table_data', value: [] });
                    }}
                    size="medium"
                    required
                />
                <InputEndAdornment
                    label={t('shapeIndex.total_mass')}
                    value={data.total_mass}
                    onChange={(e) => {
                        if (e.target.value === null) return;
                        setData({ step: 1, key: 'total_mass', value: Number(e.target.value) });
                    }}
                    adornment={'g'}
                    type="number"
                    inputProps={{ min: 0 }}
                    required
                />
                {data.method === 'sieve' ? (
                    <DropDown
                        key={'graduation'}
                        variant="standard"
                        label={t('shapeIndex.choose-graduation')}
                        options={graduationOptions.map((graduation) => {
                            return { label: graduation, value: graduation }
                        })}
                        callback={(value) => {
                            setData({ step: 1, key: 'graduation', value });
                            setData({ step: 1, key: 'circular_sieves_table_data', value: [] });
                        }}
                        size="medium"
                        required

                    />
                ) : (<></>)}
            </Box>
            {data.method ?
                data.method === 'sieve' ? (
                    <ShapeIndex_step2_Circular_Sieve_Table rows={circular_sieve_rows} columns={circular_sieve_columns} />
                ) : (
                    <ShapeIndex_step2_Sieve_Table rows={sieve_rows} columns={sieve_columns} />
                )
                : (<></>)}
        </Box>
    );
};

export default ShapeIndex_Step2;
