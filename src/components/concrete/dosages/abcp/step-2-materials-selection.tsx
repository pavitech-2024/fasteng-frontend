// import Loading from "@/components/molecules/loading";
// import { EssayPageProps } from "@/components/templates/essay";
// import useAuth from "@/contexts/auth";
// import { ConcreteMaterial } from "@/interfaces/concrete";
// import concreteMaterialService from "@/services/concrete/concrete-materials.service";
// import ABCP_SERVICE from "@/services/concrete/dosages/abcp/abcp.service";
// import useABCPStore from "@/stores/concrete/abcp/abcp.store";
// import { Box } from "@mui/material";
// import { t } from "i18next";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import MaterialSelectionTable from './tables/material-selection-table';
// import { GridColDef } from "@mui/x-data-grid";

// const ABCP_MaterialsSelection = ({
//     nextDisabled,
//     setNextDisabled,
//     abcp
// }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [materials, setMaterials] = useState<ConcreteMaterial[]>([]);
//     const { materialSelectionData, setData } = useABCPStore();

//     const { user } = useAuth();

//     useEffect(() => {
//         toast.promise(
//             async () => {
//                 const materials = await concreteMaterialService
//                     .getMaterialsByUserId(user._id)
//                     .then((response) => {
//                         setMaterials(response.data);
//                         setLoading(false);
//                     })
//                     .catch((error) => {
//                         console.error('Failed to load materials:', error);
//                     });
//             },
//             {
//                 pending: t('loading.materials.pending'),
//                 success: t('loading.materials.success'),
//                 error: t('loading.materials.error'),
//             }
//         );

//     }, [user]);

//     const aggregateRows = materials
//         .map(({ name, type }) => ({
//             name,
//             type,
//         }))
//         .filter(({ type }) => {
//             return type !== "cement"
//         });

//     const aggregateColumns: GridColDef[] = [
//         {
//             field: 'name',
//             headerName: t('name'),
//             valueFormatter: ({ value }) => `${value}`,
//         },
//         {
//             field: 'type',
//             headerName: t('type'),
//             valueFormatter: ({ value }) => t(`materials.${value}`),
//         },
//     ];

//     const binderRows = materials
//         .map(({ name, type }) => ({
//             name,
//             type,
//         }))
//         .filter(({ type }) => {
//             return type === "cement"
//         });

//     const binderColumns: GridColDef[] = [
//         {
//             field: 'name',
//             headerName: t('name'),
//             valueFormatter: ({ value }) => `${value}`,
//         },
//         {
//             field: 'type',
//             headerName: t('type'),
//             valueFormatter: ({ value }) => t(`materials.${value}`),
//         },
//         {
//             field: 'resistance',
//             headerName: t('resistance'),
//             valueFormatter: ({ value }) => `${value}`,
//         }
//     ];

//     return (
//         <>
//             {loading ? (
//                 <Loading />
//             ) : (
//                 <Box
//                     sx={{
//                         display:'grid',
//                         gap: '10px'
//                     }}
//                 >
//                     <MaterialSelectionTable rows={aggregateRows} columns={aggregateColumns} header={t('materials.aggregates')}/>
//                     <MaterialSelectionTable rows={binderRows} columns={binderColumns} header={t('materials.binders')}/>
//                 </Box>
//             )}
//         </>
//     )
// }

// export default ABCP_MaterialsSelection;

export {};
