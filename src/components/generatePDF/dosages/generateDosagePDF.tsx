import { Box, Button } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState } from 'react';
import Loading from '@/components/molecules/loading';
import { MarshallDosageData } from '@/interfaces/asphalt/marshall';
import { SuperpaveDosageData } from '@/interfaces/asphalt/superpave';
import { AbcpDosageData } from '@/interfaces/concrete/abcp';

interface IGenerateDosagePDF {
  dosage: MarshallDosageData | SuperpaveDosageData | AbcpDosageData;
  sections: string[];
}

const GenerateDosagePDF = ({ dosage, sections }: IGenerateDosagePDF) => {
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

    doc.save(`Amostra_${dosage.generalData.name}.pdf`);
    setLoading(false);
  };

  return (
    <>
      <Box onClick={dosage && generatePDF} sx={{ width: 'fit-content', paddingX: '1rem' }}>
        <Button variant="contained" color="primary" disabled={!dosage} sx={{ minWidth: '200px', minHeight: '3rem' }}>
          {loading ? <Loading size={30} color={'inherit'} /> : t('generate.dosage.button')}
        </Button>
      </Box>
    </>
  );
};

export default GenerateDosagePDF;
