import { GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { Tooltip, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import Loading from '@/components/molecules/loading';
import { StabilizedLayersData } from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { BinderAsphaltConcreteData } from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';
import { addImageProcess } from '../../common';
import logo from '../../../../assets/pro-medina/LogoBlack.png';

interface IGenerateGranularLayersPDF {
  sample: GranularLayersData | StabilizedLayersData | BinderAsphaltConcreteData;
  sections: string[];
}

const GeneratePDF_ProMedina = ({ sample, sections }: IGenerateGranularLayersPDF) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.notebook));

  const addSection = async (sectionElement: HTMLDivElement, doc: jsPDF, currentY: number): Promise<number> => {
    if (!sectionElement) return currentY;

    const canvas = await html2canvas(sectionElement);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const pageHeight = doc.internal.pageSize.getHeight();
    const xPosition = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;

    if (currentY + pdfHeight > pageHeight - 10) {
      doc.addPage();
      currentY = 5;
    }

    doc.addImage(imgData, 'PNG', xPosition, currentY, pdfWidth, pdfHeight);

    return currentY + pdfHeight + 5;
  };

  const generatePDF = async () => {
    setLoading(true);
    const doc = new jsPDF('p', 'mm', 'a4');
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;
    const imageWidth = image.width;
    const imageHeight = image.height;

    let currentY = 20;

    // Mantendo proporção ao definir o width no PDF
    const pdfWidth = 100; // Largura desejada no PDF
    const pdfHeight = (pdfWidth * imageHeight) / imageWidth; // Mantém proporção

    doc.addImage(image, 'PNG', 20, currentY, pdfWidth, pdfHeight);

    currentY += 15;

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId) as HTMLDivElement;
      if (section) {
        currentY = await addSection(section, doc, currentY);
      }
    }

    doc.save(`Amostra_${sample.generalData.name}.pdf`);
    setLoading(false);
  };

  return (
    <>
      <Tooltip
        title={isDesktop ? t('dosages.tooltips.save-dosage') : t('asphalt.tooltips.disabled-pdf-generator')}
        placement="top"
        leaveTouchDelay={5000}
        open={!isDesktop && openTooltip}
        onClose={() => setOpenTooltip(false)}
      >
        <Box
          sx={{ width: 'fit-content', paddingX: '5rem' }}
          onClick={() => {
            if (sample && isDesktop) {
              generatePDF();
            } else {
              setOpenTooltip(true);
            }
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={!sample || !isDesktop}
            sx={{ minWidth: '8rem', minHeight: '2rem' }}
          >
            {loading ? <Loading size={25} color={'inherit'} /> : t('pm.generate-pdf-button')}
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GeneratePDF_ProMedina;
