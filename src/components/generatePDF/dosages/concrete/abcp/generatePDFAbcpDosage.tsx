import { addCenteredText, calculatePageNumber, addImageProcess, addCapa } from '@/components/generatePDF/commom';
import { SummaryItem } from '@/components/generatePDF/materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';
import useAuth from '@/contexts/auth';
import { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Button } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import html2canvas from 'html2canvas';
import AbramsCurvGraph from '@/components/concrete/dosages/abcp/graph/abramsCurveGrapg';
import { createRoot } from 'react-dom/client';

interface IGeneratedPDF {
  dosages: ABCPData;
}

const GenerateAbcpDosagePDF = ({ dosages }: IGeneratedPDF) => {
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

      const lineLength = Math.floor(lineWidth / doc.getTextWidth('_'));
      const line = '_'.repeat(lineLength);

      doc.text(line, 10 + titleWidth + 2, currentY);
      doc.text(pageText, 10 + titleWidth + 2 + doc.getTextWidth(line) + 3, currentY);

      currentY += 10;
    });

    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;

    doc.setLineWidth(0.5);
    doc.line(10, lineYPosition, 200, lineYPosition);

    calculatePageNumber(doc);
  };

  const chart = document.getElementById('curve_chart') as HTMLDivElement;
  console.log("🚀 ~ GenerateAbcpDosagePDF ~ chart:", chart)

  const addChart = async (chart: any, doc: any, currentY: number) => {
    const canvas = await html2canvas(chart);
    console.log("🚀 ~ addChart ~ canvas:", canvas)
    const imgData = canvas.toDataURL('image/png');
    console.log("🚀 ~ addChart ~ imgData:", imgData)
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const xPosition = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;
    doc.addImage(imgData, 'PNG', xPosition, currentY, pdfWidth, pdfHeight);
    return (currentY += pdfHeight + 5);
  };

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    addCapa(doc, image, dosages.generalData.name);
    doc.addPage();

    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);

    let currentY = 55;
    const summaryItems: SummaryItem[] = [];

    const pageWidth = doc.internal.pageSize.getWidth();

    const sections = [
      {
        title: t('asphalt.dosages.marshall.materials-final-proportions'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.marshall.asphalt-mass-quantitative'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.binder-volumetric-mechanic-params'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.mineral-aggregate-voids'),
        page: 4,
      },
    ];

    for (const section of sections) {
      const pageIndex = section.page;
      summaryItems.push({ title: section.title, page: pageIndex });
    }

    calculatePageNumber(doc);

    doc.setPage(2);
    addSummary(doc, image, summaryItems);

    doc.addPage();

    doc.setFontSize(12);
    doc.text(`Relatório de Dosagem - ${dosages.generalData.name}`, pageWidth / 2, 30, { align: 'center' });

    // Adicionar informações do usuário
    doc.setFontSize(10);
    doc.text(`Gerado por: ${user.name}`, 10, 40);
    doc.text(`Email: ${user.email}`, 10, 45);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 50);

    // Parametros volumétricos
    doc.setFontSize(12);
    doc.text(`Resultados gerais`, pageWidth / 2, 60, {
      align: 'center',
    });

    doc.text(`${t('abcp.results.resistance-curve')}: ${dosages.results?.resistanceCurve} MPa`, 10, 75);

    const conditionValue = dosages.insertParamsData.condition;
    const tolerance = 0.0001;

    const conditionLabel =
      Math.abs(conditionValue - 4) < tolerance
        ? 'Condição A - Sd = 4,0'
        : Math.abs(conditionValue - 5.5) < tolerance
        ? 'Condição B - Sd = 5,5'
        : 'Condição C - Sd = 7,0';

    doc.text(`${conditionLabel} MPa`, 10, 85);

    doc.text(`${t('abcp.results.fck')}: ${dosages.insertParamsData.fck} MPa`, 10, 95);

    doc.text(`${t('abcp.results.reduction')}: ${dosages.insertParamsData.reduction} %`, 10, 105);

    // Resultados

    doc.setFontSize(12);
    doc.text(`Resultados`, pageWidth / 2, 120, {
      align: 'center',
    });

    doc.text(`${t('abcp.results.fcj')}: ${dosages.results?.fcj} MPa`, 10, 130);

    doc.text(`${t('abcp.results.water-cement')}: ${dosages.results?.ac} MPa`, 10, 140);

    doc.text(`${t('abcp.results.water-consume')}: ${dosages.results?.cb} Lm³`, 10, 150);

    doc.text(`${t('abcp.results.cement-consume')}: ${dosages.results?.cc} 'kg/m³`, 10, 160);

    doc.text(`${t('abcp.results.coarse-aggregate-consume')}: ${dosages.results?.cc} 'kg/m³`, 10, 170);

    doc.text(`${t('abcp.results.fine-aggregate-consume')}: ${dosages.results?.cc} 'kg/m³`, 10, 180);

    calculatePageNumber(doc);

    doc.setPage(3);

    // Coeficientes

    const cc = dosages.results.cc > 1 ? dosages.results.cc : 1;
    const ca = dosages.results.ca > 1 ? dosages.results.ca : 1;
    const coefficients = `${cc / cc} : ${(dosages.results.careia / cc).toFixed(3)} : ${(
      dosages.results.cb / cc
    ).toFixed(3)} : ${(ca / cc).toFixed(3)}`;

    doc.setFontSize(12);
    doc.text(t('abcp.result.coefficients'), pageWidth / 2, 200, {
      align: 'center',
    });

    doc.text(`${t('abcp.result.coefficients')}: ${coefficients}`, 10, 210);

    calculatePageNumber(doc);

    doc.setPage(4);

    // doc.addPage();

    addChart(chart, doc, 210);

    

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosages?.generalData.name}.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="contained" color="primary">
      Gerar PDF
    </Button>
  );
};

export default GenerateAbcpDosagePDF;
