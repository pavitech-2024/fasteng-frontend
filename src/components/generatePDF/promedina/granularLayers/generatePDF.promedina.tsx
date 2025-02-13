import useAuth from '@/contexts/auth';
import { GranularLayersData } from '@/stores/promedina/granular-layers/granular-layers.store';
import { Tooltip, Box, Button } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import Loading from '@/components/molecules/loading';
import { StabilizedLayersData } from '@/stores/promedina/stabilized-layers/stabilized-layers.store';
import { BinderAsphaltConcreteData } from '@/stores/promedina/binder-asphalt-concrete/binder-asphalt-concrete.store';

interface IGenerateGranularLayersPDF {
  sample: GranularLayersData | StabilizedLayersData | BinderAsphaltConcreteData;
  sections: string[];
}

const GeneratePDF_ProMedina = ({ sample, sections }: IGenerateGranularLayersPDF) => {
  const [loading, setLoading] = useState<boolean>(false);

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
    let currentY = 10;

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
      <Box onClick={sample && generatePDF} sx={{ width: 'fit-content', paddingX: '1rem' }}>
        <Button variant="contained" color="primary" disabled={!sample} sx={{ minWidth: '8rem', minHeight: '3rem' }}>
          {loading ? <Loading size={30} color={'inherit'} /> : t('pm.generate-pdf-button')}
        </Button>
      </Box>
    </>
  );
};

export default GeneratePDF_ProMedina;
