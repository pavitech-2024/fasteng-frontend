import {
  addCenteredText,
  addImageProcess,
  addCapa,
  SummaryItem,
  addChart,
  handleAddPage,
} from '@/components/generatePDF/common';
import useAuth from '@/contexts/auth';
import { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import Loading from '@/components/molecules/loading';
import { useState } from 'react';

interface IGeneratedPDF {
  dosage: ABCPData;
}

const GenerateAbcpDosagePDF = ({ dosage }: IGeneratedPDF) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.notebook));

  const addSummary = (doc: jsPDF, image: HTMLImageElement, summaryItems: SummaryItem[]) => {
    let currentY = 40;
    const docWidth = doc.internal.pageSize.getWidth();
    const docMargins = (docWidth * 0.2) / 2;
    const currentX = docMargins;

    addCenteredText(doc, `${t('asphalt.essays.project.summary')}`, currentY, 12);
    currentY += 20;
    let page = 3;

    summaryItems.forEach((item, idx) => {
      const title = item.title;
      const externalNumber = idx + 1;
      const totalWidth = docWidth - docMargins;
      const titleWidth = doc.getTextWidth(title);
      let lineWidth = totalWidth - titleWidth;

      if (lineWidth > docWidth - docMargins * 2 - titleWidth) {
        lineWidth = docWidth - docMargins * 2 - titleWidth - 15;
      } else if (lineWidth < docWidth - docMargins * 2 - titleWidth) {
        lineWidth = docWidth - docMargins * 2 - titleWidth + 10;
      }

      const lineLength = Math.floor(lineWidth / doc.getTextWidth('_'));
      let line = '';
      if (lineLength < 0) {
        line = '_';
      } else {
        line = '_'.repeat(lineLength);
      }

      doc.text(externalNumber + '. ' + title, currentX, currentY);
      doc.text(line, 10 + titleWidth + currentX, currentY);
      doc.text(page.toString(), totalWidth, currentY);

      page += 1;
      currentY += 10;
    });

    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;

    doc.setLineWidth(0.5);
    doc.line(10, lineYPosition, 200, lineYPosition);
  };

  const handleAddSubtitle = (text: string, doc: jsPDF, currentY: number) => {
    doc.setFontSize(12);
    doc.text(`${text}`, doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 10;

    return currentY;
  };

  const generatePDF = async () => {
    setLoading(true);
    const doc = new jsPDF('p', 'mm', 'a4');
    let currentY = 55;

    const { cc, ca, careia, cb } = dosage.results;
    const coefficients = `${cc / cc} : ${(careia / cc).toFixed(3)} : ${(cb / cc).toFixed(3)} : ${(ca / cc).toFixed(3)}`;
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    addCapa(
      doc,
      image,
      'abcp',
      dosage.createdAt.toString(),
      dosage.generalData.name,
      dosage.generalData.operator,
      dosage.generalData.laboratory
    );

    handleAddPage(doc, image, currentY, t('concrete.dosage-pdf-title'));

    const summaryItems: SummaryItem[] = [
      { title: t('abcp.general-results'), page: 3 },
      { title: t('results'), page: 3 },
      { title: t('abcp.results.coefficients'), page: 3 },
      { title: t('abcp.result.graph'), page: 4 },
    ];

    addSummary(doc, image, summaryItems);

    handleAddPage(doc, image, currentY, t('concrete.dosage-pdf-title'));

    currentY = 40;

    currentY = handleAddSubtitle(`Relatório de Dosagem - ${dosage.generalData.name}`, doc, currentY);

    currentY += 5;

    doc.setFontSize(10);
    doc.text(`Gerado por: ${user.name}`, 10, currentY);
    currentY += 5;
    doc.text(`Email: ${user.email}`, 10, currentY);
    currentY += 5;
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, currentY);

    currentY += 10;

    currentY = handleAddSubtitle('Resultados gerais', doc, currentY);

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

    generalResultsValues.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.measureUnity}`, 10, currentY);
      currentY += index + 1 === generalResultsValues.length ? 10 : 5;
    });

    currentY = handleAddSubtitle('Resultados', doc, currentY);

    resultsValues.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.measureUnity}`, 10, currentY);
      currentY += index + 1 === resultsValues.length ? 10 : 5;
    });

    currentY = handleAddSubtitle(t('abcp.result.coefficients'), doc, currentY);

    currentY = handleAddSubtitle(`${t('abcp.result.coefficients')}: ${coefficients}`, doc, currentY);

    doc.setPage(3);

    currentY = 40;

    handleAddPage(doc, image, currentY, t('concrete.dosage-pdf-title'));

    currentY = handleAddSubtitle(t('abcp.result.graph'), doc, currentY + 5);

    await addChart(document.getElementById('chart-div-abramsCurveGraph') as HTMLDivElement, doc, currentY);

    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
    setLoading(false);
  };

  return (
    <>
      {dosage?.results && isDesktop && (
        <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
          <Box onClick={generatePDF} sx={{ width: 'fit-content' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!dosage?.results}
              sx={{ minWidth: '200px', minHeight: '2rem' }}
            >
              {loading ? <Loading size={25} color={'inherit'} /> : t('generate.dosage.button')}
            </Button>
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default GenerateAbcpDosagePDF;
