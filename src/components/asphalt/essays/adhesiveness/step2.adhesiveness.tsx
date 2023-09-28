import { EssayPageProps } from "@/components/templates/essay";
import useAdhesivenessStore from "@/stores/asphalt/adhesiveness.store";
import { Box } from "@mui/material";
import { t } from "i18next";

const ADHESIVENESS_Step2 = ({ nextDisabled, setNextDisabled }: EssayPageProps) => {
  const { adhesiveness: data, setData } = useAdhesivenessStore();
  console.log("🚀 ~ file: step2.adhesiveness.tsx:8 ~ setData:", setData)

  const inputs = [
    {
      label: t('adhesiveness.filmDisplacement'),
      adornment: 'L',
      key: 'displaced_volume',
      value: data.filmDisplacement,
      required: true,
    },
  ];

  // verificar se todos os required estão preenchidos, se sim setNextDisabled(false)
  inputs.every(({ required, value }) => {
    if (!required) return true;

    if (value === null) return false;

    return true;
  }) &&
    nextDisabled &&
    setNextDisabled(false);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      
    </Box>
  );
};

export default ADHESIVENESS_Step2;