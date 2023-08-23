import InputEndAdornment from '@/components/atoms/inputs/input-endAdornment';
import { EssayPageProps } from '@/components/templates/essay';
import useSandIncreaseStore from '@/stores/concrete/sandIncrease/sandIncrease.store';
import { Box } from '@mui/material';
import { t } from 'i18next';

const SandIncrease_Step2 = ({}: // nextDisabled,
// setNextDisabled
EssayPageProps) => {
  const { unitMassDeterminationData: data, setData } = useSandIncreaseStore();
  // const rows = data.sandIncreaseSamples as sandIncreaseSamples[];

  const inputs = [
    {
      label: t('sandIncrease.container_volume'),
      value: data.containerVolume,
      key: 'containerVolume',
      required: true,
      adornment: 'l',
    },
    {
      label: t('sandIncrease.container_weight'),
      value: data.containerWeight,
      key: 'containerWeight',
      required: true,
      adornment: 'g',
    },
  ];

  // const columns: GridColDef[] = [
  //   {
  //     field: 'samples',
  //     headerName: t('sandIncrease.samples'),
  //     renderCell: ({ row }) => (
  //       // <InputEndAdornment
  //       //   fullWidth
  //       //   label={t('sandIncrease.samples')}
  //       //   type="string"
  //       //   inputProps={{ min: 0 }}
  //       //   value={row.samples}
  //       //   // onChange={(e) => {
  //       //   //   const newRows = [...rows];
  //       //   //   const index = rows.findIndex((r) => r.id === row.id);
  //       //   //   newRows[index].capsulesNumberHyg = Number(e.target.value);
  //       //   //   setData({ step: 2, value: newRows });
  //       //   // }}
  //       //   adornment={''} 
  //       //   // onChange={function (e: ChangeEvent<HTMLInputElement>): void {
  //       //   //   throw new Error('Function not implemented.');
  //       //   // } }        
  //       // />
  //     ),
  //   },
  // ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          justifyContent: { mobile: 'center', notebook: 'center' },
          flexWrap: 'wrap',
        }}
      >
        {inputs.map((input) => (
          <Box key={input.key}>
            <InputEndAdornment
              fullWidth
              label={input.label}
              value={input.value}
              required={input.required}
              onChange={(e) => setData({ step: 1, key: input.key, value: e.target.value })}
              adornment={input.adornment}
              type="number"
              inputProps={{ min: 0 }}
            />
          </Box>
        ))}
      </Box>
      {/* <DataGrid
        sx={{ mt: '1rem', borderRadius: '10px' }}
        density="compact"
        showCellVerticalBorder
        showColumnVerticalBorder
        //rows={rows.map((row, index) => ({ ...row, id: index }))}
        columns={columns.map((column) => ({
          ...column,
          sortable: false,
          disableColumnMenu: true,
          align: 'center',
          headerAlign: 'center',
          minWidth: 200,
          flex: 1,
        }))}
      /> */}
    </Box>
  );
};

export default SandIncrease_Step2;
