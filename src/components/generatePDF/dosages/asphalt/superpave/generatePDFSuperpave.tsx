import { addCenteredText, calculatePageNumber, addImageProcess, addCapa } from '@/components/generatePDF/common';
import { SummaryItem } from '@/components/generatePDF/materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';
import useAuth from '@/contexts/auth';
import { Box, Button, Tooltip } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import html2canvas from 'html2canvas';
import { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import autoTable from 'jspdf-autotable';

interface IGeneratedPDF {
  dosage: SuperpaveData;
}

const GenerateSuperpaveDosagePDF = ({ dosage }: IGeneratedPDF) => {
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

  const addHeader = (doc: jsPDF, image: HTMLImageElement) => {
    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);
  };

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 55;

    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    addCapa(doc, image, dosage.generalData.name);
    doc.addPage();

    addHeader(doc, image);

    const summaryItems: SummaryItem[] = [
      { title: t('superpave.step-11'), page: 3 },
      { title: t('asphalt.dosages.superpave.asphalt-mass-quantitative'), page: 3 },
      { title: t('asphalt.dosages.superpave.mechanic-volumetric-params'), page: 3 },
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
    doc.text(t('superpave.step-11'), doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
    currentY = 70;

    const materials = dosage?.materialSelectionData?.aggregates?.map((material) => material.name) || [];

    materials.push(t('asphalt.dosages.optimum-binder'));

    const finalProportionsBody =
      dosage?.dosageResume?.ponderatedPercentsOfDosage?.map((percent) => percent.toFixed(2)) || [];

    autoTable(doc, {
      head: [materials],
      body: [finalProportionsBody],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: currentY,
    });

    currentY = currentY + 30;

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.superpave.asphalt-mass-quantitative'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 10;

    const quantitativesBody = dosage.dosageResume.quantitative.map((item) => item.toFixed(2));

    autoTable(doc, {
      head: [materials],
      body: [quantitativesBody],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: currentY,
    });

    currentY += 40;

    doc.setFontSize(12);
    doc.text(
      t('asphalt.dosages.superpave.mechanic-volumetric-params'),
      doc.internal.pageSize.getWidth() / 2,
      currentY,
      { align: 'center' }
    );

    currentY += 20;

    const volumetricsBody = [
      {
        label: t('asphalt.dosages.superpave.apparent-specific-mass') + ' (Gmb)',
        value: dosage.dosageResume.Gmb.toFixed(2).toString(),
        unity: 'g/cm3',
      },
      {
        label: t('asphalt.dosages.superpave.void-volume') + ' (Vv)',
        value: (dosage.dosageResume.Vv * 100).toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('Vazios do agregado mineral (VAM)'),
        value: dosage.dosageResume.Vam?.toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.rbv') + ' (RBV)',
        value: (dosage.dosageResume.RBV * 100).toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.absorbed-water'),
        value: dosage.dosageResume.percentWaterAbs.toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.superpave.specific-mass'),
        value: dosage.dosageResume.specifiesMass.toFixed(2).toString(),
        unity: 'g/cm',
      },
    ];

    volumetricsBody.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.unity}`, 10, currentY);
      currentY += index + 1 === volumetricsBody.length ? 20 : 5;
    });

    calculatePageNumber(doc);

    doc.setPage(3);

    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
        <Box onClick={dosage?.dosageResume && generatePDF} sx={{ width: 'fit-content' }}>
          <Button variant="contained" color="primary" disabled={!dosage?.dosageResume}>
            Gerar PDF
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GenerateSuperpaveDosagePDF;
