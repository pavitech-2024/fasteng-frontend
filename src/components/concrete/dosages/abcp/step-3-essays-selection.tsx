import Loading from "@/components/molecules/loading";
import { EssayPageProps } from "@/components/templates/essay";
import useAuth from "@/contexts/auth";
import ABCP_SERVICE from "@/services/concrete/dosages/abcp/abcp.service";
import useABCPStore, { ABCPData } from "@/stores/concrete/abcp/abcp.store";
import { Box } from "@mui/material";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ABCP_EssaySelection = ({ nextDisabled, setNextDisabled, abcp }: EssayPageProps & { abcp: ABCP_SERVICE }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [essays, setEssays] = useState<ABCPData['essaySelectionData']>();
    const { essaySelectionData, materialSelectionData } = useABCPStore();

    const { user } = useAuth();

    useEffect(() => {
        toast.promise(
            async () => {
                try {
                    const essays = await abcp.getEssaysByMaterialId(user._id, materialSelectionData);
                    setEssays(essays);
                    setLoading(false);
                } catch (error) {
                    console.log(error)
                    setEssays(null);
                    setLoading(false);
                    throw error;
                }
            },
            {
                pending: t('loading.essays.pending'),
                success: t('loading.essays.success'),
                error: t('loading.essays.error'),
            }
        );
    }, []);

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
          {/* <MaterialSelectionTable rows={aggregateRows} columns={aggregateColumns} header={t('materials.aggregates')} />
          <MaterialSelectionTable rows={binderRows} columns={binderColumns} header={t('materials.binders')} /> */}
        </Box>
      )}
    </>
    )
}

export default ABCP_EssaySelection