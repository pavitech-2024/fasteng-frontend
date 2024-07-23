import DropDown from "@/components/atoms/inputs/dropDown";
import InputEndAdornment from "@/components/atoms/inputs/input-endAdornment";
import { EssayPageProps } from "@/components/templates/essay";
import { SieveSeries } from "@/interfaces/common";
import { getSieveSeries } from "@/utils/sieves";
import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { t } from "i18next";


const ConcreteRc_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
    const { step2Data: data, setData } = useConcreteRcStore();
  
    const sievesSeries = [getSieveSeries(0), getSieveSeries(1), getSieveSeries(2), getSieveSeries(3), getSieveSeries(4)];
  
    if (data.sieve_series && data.table_data && data.table_data.length == 0) {
      const table_data = [];
      data.sieve_series.map((s) => {
        table_data.push({ sieve: s.label, passant: 100, retained: 0 });
      });
      setData({ step: 1, key: 'table_data', value: table_data });
    }
  
    const rows = data.table_data;
  
    const columns: GridColDef[] = [
      {
        field: 'sieve',
        headerName: t('concreteRc-concrete.sieves'),
        valueFormatter: ({ value }) => `${value}`,
      },
      {
        field: 'passant',
        headerName: t('concreteRc-concrete.passant'),
        renderCell: ({ row }) => {
          if (!rows) {
            return;
          }
          const { sieve } = row;
          const sieve_index = rows.findIndex((r) => r.sieve === sieve);
  
          return (
            <InputEndAdornment
              fullWidth
              adornment="%"
              type="number"
              inputProps={{ min: 0 }}
              value={rows[sieve_index].passant}
              required
              onChange={(e) => {
                if (e.target.value === null) return;
                const newRows = [...rows];
                const mass = data.material_mass;
                const current_passant = Number(e.target.value);
  
                const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
                const initial_retained = 0;
                const accumulative_retained = currentRows.reduce(
                  (accumulator: number, current_value) => accumulator + current_value.retained,
                  initial_retained
                );
  
                const current_retained =
                  Math.round(100 * (mass !== 0 ? ((100 - current_passant) / 100) * mass - accumulative_retained : 0)) /
                  100;
  
                newRows[sieve_index].passant = current_passant;
                newRows[sieve_index].retained = current_retained;
                setData({ step: 1, key: 'passant', value: newRows });
                setData({ step: 1, key: 'retained', value: newRows });
  
                const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...rows];
  
                const new_current_accumulative_retained = accumulative_retained;
  
                console.log(new_current_accumulative_retained);
  
                nextRows.map(function (item, index) {
                  const row = item;
  
                  console.log(row);
  
                  if (index > 0) {
                    const currentRows = nextRows.slice(0, index + 1);
  
                    const initial_retained = new_current_accumulative_retained;
                    const accumulative_retained = currentRows.reduce(
                      (accumulator: number, current_value) => accumulator + current_value.retained,
                      initial_retained
                    );
  
                    console.log(accumulative_retained);
  
                    const retained =
                      Math.round(100 * (mass !== 0 ? ((100 - row.passant) / 100) * mass - accumulative_retained : 0)) /
                      100;
  
                    const passant =
                      Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;
  
                    console.log(passant);
                    console.log(retained);
  
                    newRows.map((e) => {
                      if (e.sieve === row.sieve) {
                        e.passant = passant;
                      }
                    });
                    // newRows[sieve_index + index].retained = retained;
                  }
                });
  
                setData({ step: 1, key: 'table_data', value: newRows });
              }}
            />
          );
        },
      },
      {
        field: 'retained',
        headerName: t('concreteRc-concrete.retained'),
        renderCell: ({ row }) => {
          if (!rows) {
            return;
          }
          const { sieve } = row;
          const sieve_index = rows.findIndex((r) => r.sieve === sieve);
  
          return (
            <InputEndAdornment
              fullWidth
              adornment="g"
              type="number"
              inputProps={{ min: 0 }}
              value={rows[sieve_index].retained}
              required
              onChange={(e) => {
                if (e.target.value === null) return;
                const newRows = [...rows];
                const mass = data.material_mass;
                const current_retained = Number(e.target.value);
  
                const currentRows = sieve_index > 0 ? newRows.slice(0, sieve_index) : [];
                const initial_retained = current_retained;
                const current_accumulative_retained = currentRows.reduce(
                  (accumulator: number, current_value) => accumulator + current_value.retained,
                  initial_retained
                );
  
                const current_passant =
                  Math.round(100 * (mass !== 0 ? (100 * (mass - current_accumulative_retained)) / mass : 0)) / 100;
                newRows[sieve_index].retained = current_retained;
                newRows[sieve_index].passant = current_passant;
                setData({ step: 1, key: 'retained', value: newRows });
                setData({ step: 1, key: 'passant', value: newRows });
  
                const nextRows = sieve_index > 0 ? newRows.slice(sieve_index) : [...rows];
  
                const new_current_accumulative_retained = current_accumulative_retained - current_retained;
  
                console.log(new_current_accumulative_retained);
  
                nextRows.map(function (item, index) {
                  const row = item;
  
                  console.log(row);
  
                  if (index > 0) {
                    const currentRows = nextRows.slice(0, index + 1);
  
                    const initial_retained = new_current_accumulative_retained;
                    const accumulative_retained = currentRows.reduce(
                      (accumulator: number, current_value) => accumulator + current_value.retained,
                      initial_retained
                    );
  
                    console.log(accumulative_retained);
  
                    // const retained =
                    // Math.round(
                    //   100 *
                    //     (mass !== 0 ? ((100 - row.passant) / 100) * mass - accumulative_retained : 0)
                    // ) / 100;
  
                    const passant =
                      Math.round(100 * (mass !== 0 ? (100 * (mass - accumulative_retained)) / mass : 0)) / 100;
  
                    console.log(passant);
                    console.log(item.retained);
  
                    newRows.map((e) => {
                      if (e.sieve === row.sieve) {
                        e.passant = passant;
                      }
                    });
                    // newRows[sieve_index + index].retained = retained;
                  }
                });
  
                setData({ step: 1, key: 'table_data', value: newRows });
              }}
            />
          );
        },
      },
    ];
  
    if (
      nextDisabled &&
      data.material_mass != null &&
      data.bottom != null &&
      data.table_data.every((row) => row.passant !== null && row.retained !== null)
    )
      setNextDisabled(false);
  
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
          <InputEndAdornment
            label={t('concreteRc.material_mass')}
            value={data.material_mass}
            onChange={(e) => {
              if (e.target.value === null) return;
              const mass = Number(e.target.value);
  
              setData({ step: 1, key: 'material_mass', value: mass });
  
              if (rows === null) return;
  
              const newRows = [];
  
              rows.map(function (item, index) {
                const row = item;
  
                const currentRows = index > 0 ? newRows.slice(0, index) : [];
                const initial_retained = 0;
                const acumulative_retained = currentRows.reduce(
                  (accumulator: number, current_value) => accumulator + current_value.retained,
                  initial_retained
                );
  
                row.retained =
                  Math.round(100 * (mass !== 0 ? ((100 - row.passant) / 100) * mass - acumulative_retained : 0)) / 100;
  
                newRows.push({ ...row });
              });
              setData({ step: 1, key: 'table_data', value: newRows });
            }}
            adornment={'g'}
            type="number"
            inputProps={{ min: 0 }}
            required
          />
  
          <DropDown
            key={'sieve_series'}
            variant="standard"
            label={t('concreteRc-concrete.choose-series')}
            options={sievesSeries.map((sieveSeries: SieveSeries) => {
              return { label: sieveSeries.label, value: sieveSeries.sieves };
            })}
            callback={(value) => {
              setData({ step: 1, key: 'sieve_series', value });
              setData({ step: 1, key: 'table_data', value: [] });
            }}
            size="medium"
            required
          />
        </Box>
        <ConcreteRc_step2Table rows={rows} columns={columns} />
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { mobile: '1fr', notebook: '1fr 1fr 1fr 1fr' },
            gap: '10px',
            mt: '20px',
          }}
        >
          <Box key={'bottom'}>
            <InputEndAdornment
              label={t('concreteRc-concrete.bottom')}
              value={data.bottom}
              onChange={(e) => setData({ step: 1, key: 'bottom', value: Number(e.target.value) })}
              adornment={'g'}
              type="number"
              inputProps={{ min: 0 }}
              required
            />
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default ConcreteRc_Step2;
  