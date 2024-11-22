import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import logo from '@/assets/fasteng/LogoBlack.png';
import { SummaryItem } from '../../materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';

interface IGeneratedPDF {
  dosages: MarshallData;
}

const GenerateDosagePDF = ({ dosages }: IGeneratedPDF) => {
  const { user } = useAuth();

  const addImageProcess = async (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const addCenteredText = (doc: any, text: any, y: any, fontSize = 24) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.setFontSize(fontSize);
    doc.text(x, y, text);
  };

  const addTextToRightMargin = (doc: any, text: string, blockWidth: number, y: number, padding = 10) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = pageWidth - blockWidth;

    const lines = [];
    let currentLine = '';
    const words = text.split(' ');

    const addLine = (line: string) => {
      if (line.trim()) {
        lines.push(line);
      }
    };

    words.forEach((word) => {
      const testLine = `${currentLine} ${word}`.trim();
      const testWidth = (doc.getStringUnitWidth(testLine) * doc.internal.getFontSize()) / doc.internal.scaleFactor;

      if (testWidth > blockWidth - 2 * padding) {
        addLine(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    addLine(currentLine);

    lines.forEach((line, index) => {
      const lineWidth = (doc.getStringUnitWidth(line) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
      doc.text(line, x + blockWidth - lineWidth - padding, y + index * 10);
    });
  };

  const getCurrentDateFormatted = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const addPageNumber = (doc: any, pageNumber: number) => {
    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;

    doc.setLineWidth(0.5);
    doc.line(10, lineYPosition, 200, lineYPosition);
    addCenteredText(doc, `${pageNumber}`, lineYPosition + 5, 10);
  };

  const calculatePageNumber = (doc: any) => {
    const totalPages = doc.internal.pages.length;
    for (let pageNumber = 1; pageNumber < totalPages; pageNumber++) {
      if (pageNumber > 1) {
        doc.setPage(pageNumber);
        addPageNumber(doc, pageNumber);
      }
    }
  };

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

  const addCapa = (doc: any, logo: any, dosageName: string, materialName?: string) => {
    doc.addImage(logo, 'png', 5, 5, 50, 8);
    doc.addImage(logo, 'png', 155, 5, 50, 8);

    let currentY = 55;
    addCenteredText(doc, `${t('asphalt.essays.project.title')}`, currentY, 12);
    currentY += 50;
    addCenteredText(doc, `${t('asphalt.essays.project.name')}: ${dosageName}`, currentY, 12);
    currentY += 90;

    if (materialName) {
      addTextToRightMargin(doc, `${t('asphalt.essays.project.description.text')} ${materialName}`, 100, currentY);
    }

    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;
    const dateYPosition = lineYPosition - 5;

    const formattedDate = getCurrentDateFormatted();

    addCenteredText(doc, formattedDate, dateYPosition, 12);
  };

  const addTextToLeftMargin = (doc: any, text: any, margin: any, y: any, fontSize = 12) => {
    const x = margin;
    doc.setFontSize(fontSize);
    doc.text(x, y, text);
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

    // Adicionar resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:', 10, 60);

    // Exemplo de tabela com autoTable
    const materials = dosages?.materialSelectionData?.aggregates?.map((material) => material.name) || [];

    const optimumBinder =
      dosages?.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.map((confirmedPercentsOfDosage) =>
        confirmedPercentsOfDosage.toFixed(2)
      ) || [];

    materials.push(t('asphalt.dosages.optimum-binder'));

    optimumBinder.push(dosages.optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2));

    doc.setFontSize(12);
    doc.text(`Proporção final dos materiais`, pageWidth / 2, 90, { align: 'center' });

    autoTable(doc, {
      head: [materials],
      body: [optimumBinder],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: 100,
    });

    //Quantitativos

    doc.setFontSize(12);
    doc.text(`Quantitativo para 1 metro cúbico de massa asfáltica`, pageWidth / 2, 140, { align: 'center' });

    const quantitative =
      dosages?.confirmationCompressionData?.confirmedVolumetricParameters?.quantitative.map(
        (confirmedPercentsOfDosage) => confirmedPercentsOfDosage.toFixed(2)
      ) || [];

    const segundaTabelaConfig = {
      head: [materials],
      body: [quantitative],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: 150, // Posição vertical do segundo table
    };

    autoTable(doc, segundaTabelaConfig);

    // Parametros volumétricos
    doc.setFontSize(12);
    doc.text(`Parâmetros volumétricos e mecanicos da mistura no teor ótimo de ligante asfáltico`, pageWidth / 2, 190, {
      align: 'center',
    });

    doc.text(
      `${t('asphalt.dosages.optimum-binder')}: ${dosages.optimumBinderContentData.optimumBinder.optimumContent.toFixed(
        2
      )} %`,
      10,
      200
    );

    doc.text(
      `${t('asphalt.dosages.dmt')}: ${dosages.confirmationCompressionData.confirmedSpecificGravity?.result.toFixed(
        2
      )} g/cm³`,
      10,
      205
    );

    doc.text(
      `${t(
        'asphalt.dosages.gmb'
      )}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity.toFixed(
        2
      )} g/cm³`,
      10,
      210
    );

    doc.text(
      `${t('asphalt.dosages.vv')}: ${(
        dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100
      ).toFixed(2)} %`,
      10,
      215
    );

    doc.text(
      `${t(
        'asphalt.dosages.vam'
      )}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.voidsFilledAsphalt.toFixed(
        2
      )} %`,
      10,
      220
    );

    doc.text(
      `${t('asphalt.dosages.rbv') + ' (RBV)'}: ${(
        dosages.confirmationCompressionData?.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100
      ).toFixed(2)} %`,
      10,
      225
    );

    doc.text(
      `${t(
        'asphalt.dosages.marshall-stability'
      )}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.stability.toFixed(2)} N`,
      10,
      230
    );

    doc.text(
      `${t(
        'asphalt.dosages.fluency'
      )}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.fluency.toFixed(2)} MPa`,
      10,
      235
    );

    calculatePageNumber(doc);

    doc.setPage(3);

    // Volumetric params table

    // Adicione uma nova página ao documento
    doc.addPage();

    const headers = [
      t('asphalt.dosages.marshall.parameter'),
      t('asphalt.dosages.marshall.unity'),
      t('asphalt.dosages.marshall.bearing-layer'),
      t('asphalt.dosages.marshall.bonding-layer'),
    ];

    const volumetricParamsRows = [
      [t('asphalt.dosages.stability'), 'Kgf', '>=500', '>=500'],
      [t('asphalt.dosages.rbv'), '%', '75 - 82', '65 - 72'],
      [t('asphalt.dosages.mixture-voids'), '%', '3 - 5', '4 - 6'],
      [`${t('asphalt.dosages.indirect-tensile-strength')}` + ` (25 °C)`, 'MPa', '>= 0,65', '>= 0,65'],
    ];

    const volumetricParamsTable = {
      head: [headers],
      body: volumetricParamsRows,
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: 20, // Posição vertical do segundo table
    };

    doc.setFontSize(12);
    doc.text(`Quantitativo para 1 metro cúbico de massa asfáltica`, pageWidth / 2, 10, { align: 'center' });

    autoTable(doc, volumetricParamsTable);

    // Vazios do agregado mineral

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.mineral-aggregate-voids'), pageWidth / 2, 80, { align: 'center' });

    const mineralAggregateVoidsHeaders = ['TMN', 'Vam (%'];

    const mineralAggregateVoidsbody = [
      ['9,5mm', '>= 18'],
      ['12,5mm', '>= 16'],
      ['19,1mm', '>= 15'],
    ];

    const mineralAgregateVoidsTable = {
      head: [mineralAggregateVoidsHeaders],
      body: mineralAggregateVoidsbody,
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: 90, // Posição vertical do segundo table
    };

    autoTable(doc, mineralAgregateVoidsTable);

    calculatePageNumber(doc);

    doc.setPage(4);

    // Seções adicionais
    // Exemplo de adicionar gráficos ou outros dados
    // const chartElement = document.getElementById('chart-div');
    // if (chartElement) {
    //   const chartCanvas = await html2canvas(chartElement);
    //   const chartImage = chartCanvas.toDataURL('image/png');
    //   // doc.addImage(chartImage, 'PNG', 10, doc?.lastAutoTable.finalY + 10, 180, 90);
    // }

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosages?.generalData.name}.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="contained" color="primary">
      Gerar PDF
    </Button>
  );
};

export default GenerateDosagePDF;
