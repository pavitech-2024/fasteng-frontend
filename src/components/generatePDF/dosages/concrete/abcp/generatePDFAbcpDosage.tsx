import { addCenteredText, calculatePageNumber, addImageProcess, addCapa } from '@/components/generatePDF/common';
import { SummaryItem } from '@/components/generatePDF/materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';
import useAuth from '@/contexts/auth';
import { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, Button, Tooltip } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import html2canvas from 'html2canvas';

interface IGeneratedPDF {
  dosage: ABCPData;
}

const GenerateAbcpDosagePDF = ({ dosage }: IGeneratedPDF) => {
  const { user } = useAuth();

  const addSummary = (doc: jsPDF, image: HTMLImageElement, summaryItems: SummaryItem[]) => {
    let currentY = 30;

    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);

    addCenteredText(doc, `${t('asphalt.essays.project.summary')}`, currentY, 12);
    currentY += 20;

    summaryItems.forEach((item) => {
      const title = item.title;
      const pageText = `${t('asphalt.essays.project.page')} ${item.page}`;
      const titleWidth = doc.getTextWidth(title);
      const pageWidth = doc.getTextWidth(pageText);
      const totalWidth = 190;
      const lineWidth = totalWidth - (titleWidth + pageWidth + 5);

      doc.text(title, 10, currentY);

      const line = '_'.repeat(Math.floor(lineWidth / doc.getTextWidth('_')));
      doc.text(line, 12 + titleWidth, currentY);
      doc.text(pageText, 15 + titleWidth + doc.getTextWidth(line), currentY);

      currentY += 10;
    });

    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;

    doc.setLineWidth(0.5);
    doc.line(10, lineYPosition, 200, lineYPosition);

    calculatePageNumber(doc);
  };

  const addChart = async (chartElement: HTMLDivElement, doc: jsPDF, currentY: number) => {
    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const xPosition = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;
    doc.addImage(imgData, 'PNG', xPosition, currentY, pdfWidth, pdfHeight);
  };

  const addHeader = (doc: jsPDF, image: HTMLImageElement) => {
    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);
  };

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 55;

    const { cc, ca, careia, cb } = dosage.results;
    const coefficients = `${cc / cc} : ${(careia / cc).toFixed(3)} : ${(cb / cc).toFixed(3)} : ${(ca / cc).toFixed(3)}`;
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    addCapa(doc, image, dosage.generalData.name);
    doc.addPage();

    addHeader(doc, image);

    const summaryItems: SummaryItem[] = [
      { title: t('abcp.general-results'), page: 3 },
      { title: t('results'), page: 3 },
      { title: t('abcp.results.coefficients'), page: 3 },
      { title: t('abcp.result.graph'), page: 4 },
    ];

    calculatePageNumber(doc);

    doc.setPage(2);
    addSummary(doc, image, summaryItems);

    doc.addPage();

    doc.setFontSize(12);
    doc.text(`Relatório de Dosagem - ${dosage.generalData.name}`, doc.internal.pageSize.getWidth() / 2, 30, {
      align: 'center',
    });

    doc.setFontSize(10);
    doc.text(`Gerado por: ${user.name}`, 10, 40);
    doc.text(`Email: ${user.email}`, 10, 45);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 50);

    addHeader(doc, image);

    doc.setFontSize(12);
    doc.text(`Resultados gerais`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

    const conditionValue = dosage.insertParamsData.condition;
    const tolerance = 0.0001;

    const conditionLabel =
      Math.abs(conditionValue - 4) < tolerance
        ? 'Condição A - Sd = 4,0'
        : Math.abs(conditionValue - 5.5) < tolerance
        ? 'Condição B - Sd = 5,5'
        : 'Condição C - Sd = 7,0';

    const generalResultsValues = [
      { label: t('abcp.results.resistance-curve'), value: dosage.results?.resistanceCurve, measureUnity: 'MPa' },
      { label: conditionLabel, value: '', measureUnity: 'MPa' },
      { label: t('abcp.results.fck'), value: dosage.insertParamsData.fck, measureUnity: 'MPa' },
      { label: t('abcp.results.reduction'), value: dosage.insertParamsData.reduction, measureUnity: '%' },
    ];

    const resultsValues = [
      { label: t('abcp.results.fcj'), value: dosage.results?.fcj, measureUnity: 'MPa' },
      { label: t('abcp.results.water-cement'), value: dosage.results?.ac, measureUnity: 'MPa' },
      { label: t('abcp.results.water-consume'), value: dosage.results?.cb, measureUnity: 'Lm³' },
      { label: t('abcp.results.cement-consume'), value: dosage.results?.cc, measureUnity: 'kg/m³' },
      { label: t('abcp.results.coarse-aggregate-consume'), value: dosage.results?.cc, measureUnity: 'kg/m³' },
      { label: t('abcp.results.fine-aggregate-consume'), value: dosage.results?.cc, measureUnity: 'kg/m³' },
    ];

    currentY = 75;

    generalResultsValues.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.measureUnity}`, 10, currentY);
      currentY += index + 1 === generalResultsValues.length ? 20 : 5;
    });

    doc.setFontSize(12);
    doc.text(`Resultados`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    currentY += 20;

    resultsValues.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.measureUnity}`, 10, currentY);
      currentY += index + 1 === resultsValues.length ? 20 : 5;
    });

    currentY += 20;

    doc.setFontSize(12);
    doc.text(t('abcp.result.coefficients'), doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    currentY += 20;

    doc.text(`${t('abcp.result.coefficients')}: ${coefficients}`, 10, currentY);

    calculatePageNumber(doc);

    doc.setPage(3);
    doc.addPage();

    addHeader(doc, image);

    currentY = 30;

    doc.setFontSize(12);
    doc.text(t('abcp.result.graph'), doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    await addChart(document.getElementById('chart-div-abramsCurveGraph') as HTMLDivElement, doc, currentY + 5);

    calculatePageNumber(doc);

    doc.setPage(4);

    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
        <Box onClick={dosage?.results && generatePDF} sx={{ width: 'fit-content' }}>
          <Button variant="contained" color="primary" disabled={!dosage?.results}>
            Gerar PDF
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GenerateAbcpDosagePDF;
