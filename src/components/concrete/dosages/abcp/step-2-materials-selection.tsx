import Loading from '@/components/molecules/loading';
import { EssayPageProps } from '@/components/templates/essay';
import useAuth from '@/contexts/auth';
import { ConcreteMaterial, ConcreteMaterialTypes } from '@/interfaces/concrete';
import ABCP_SERVICE from '@/services/concrete/dosages/abcp/abcp.service';
import useABCPStore, { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { toast, useToast } from 'react-toastify';
import { GridColDef } from '@mui/x-data-grid';
import BinderSelectionTable from './tables/binder-selection-table';
import { Toast } from 'react-toastify/dist/components';
import Step2Table from './tables/test';

const ABCP_MaterialsSelection = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {

  const { storedData, materialSelectionData, setData } = useABCPStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
  const [agglomerateSearchValue, setAgglomerateSearchValue] = useState<string>('');
  const [binderSearchValue, setBinderSearchValue] = useState<string>('');
  const { user } = useAuth();

  // const [ errors, setErrors] = useState<AggregateErrors>({
  //   type: '',
  //   error: ''
  // })

  useEffect(() => {
    if (storedData?.materialSelectionData) setData({ step: 1, value: storedData.materialSelectionData })
  }, [storedData])

  // useEffect(() => {
  //   console.log("🚀 ~ errors:", errors)

  //   if (errors.error && errors.type) {
  //     toast.error(errors.error);
  //   }
  // },[errors])

  useEffect(() => {
    toast.promise(
      async () => {
        try {
          const materials = await abcp.getMaterialsByUserId(user._id);
          setMaterials(materials);
          setLoading(false);
        } catch (error) {
          setMaterials([]);
          setLoading(false);
          throw error;
        }
      },
      {
        pending: t('loading.materials.pending'),
        success: t('loading.materials.success'),
        error: t('loading.materials.error'),
      }
    );
  }, []);

  const handleAgglomerateInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgglomerateSearchValue(value);
  }

  const handleBinderInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBinderSearchValue(value);
  }

  const filteredMaterials = materials
    .filter(({ name, type }) => name.includes(agglomerateSearchValue) || type.includes(agglomerateSearchValue))

  const aggregateRows = [
    {
      inputComponent: <TextField label={t("concrete.search")} variant="standard" onChange={handleAgglomerateInputSearch}/>,
      type: 'input'
    },
    ...filteredMaterials.map(({ _id, name, type }) => {
      let translatedType = type;

      if (type === 'fineAggregate') {
        translatedType = t("abcp.step-3.fine-aggregate") as ConcreteMaterialTypes
      } else if (type === 'coarseAggregate') {
        translatedType = t("abcp.step-3.coarse-aggregate") as ConcreteMaterialTypes
      }

      return {
        _id,
        name,
        type: translatedType,
      };
    }).filter(({ type }) => type === t("abcp.step-3.fine-aggregate") || type === t("abcp.step-3.coarse-aggregate")),
  ];

  const aggregateColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('type'),
      valueFormatter: ({ value }) => t(`concrete.materials.${value}`),
    },
  ];

  const filteredBinderMaterials = materials
    .filter(({ name, type }) => name.includes(binderSearchValue) || type.includes(binderSearchValue))

  const binderRows = [
    {
      inputComponent: <TextField label={t("concrete.search")} variant='standard' onChange={handleBinderInputSearch} />
    },
    ...filteredBinderMaterials
      .map(({ _id, name, type, description }) => {
        const { resistance } = description;
        return {
          _id,
          name,
          type,
          resistance,
        };
      })
      .filter(({ type }) => {
        return type === 'cement';
      })
  ]

  const binderColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: 'type',
      headerName: t('type'),
      valueFormatter: ({ value }) => t(`concrete.materials.${value}`),
    },
    {
      field: 'resistance',
      headerName: t('resistance'),
      valueFormatter: ({ value }) => `${value}`,
    },
  ];

  useEffect(() => {
    console.log("🚀 ~ materialSelectionData:", materialSelectionData)
  }, [materialSelectionData]);

  if (
    materialSelectionData?.cement?.id !== null && 
    materialSelectionData?.coarseAggregate?.id !== null && 
    materialSelectionData?.fineAggregate?.id !== null
  ) {
    console.log("deu")
    setNextDisabled(false)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: '10px',
          }}
        >
          {/* <MaterialSelectionTable
            rows={aggregateRows}
            columns={aggregateColumns}
            header={t('concrete.materials.aggregates')}
            handleErrors={(error: AggregateErrors) => setErrors(error)}
          />
          <BinderSelectionTable rows={binderRows} columns={binderColumns} header={t('concrete.materials.binders')} /> */}
          <Step2Table
            rows={aggregateRows}
            columns={aggregateColumns}
            abcp={new ABCP_SERVICE}
          />

          <Step2Table
            rows={binderRows}
            columns={binderColumns}
            abcp={new ABCP_SERVICE}
          />
        </Box>
      )}
    </>
  );
};

export default ABCP_MaterialsSelection;
