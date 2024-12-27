import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import { Box, Button, Tooltip } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import logo from '@/assets/fasteng/LogoBlack.png';
import { SummaryItem } from '../../../materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';
import { addCapa, addCenteredText, addImageProcess, calculatePageNumber } from '../../../common';

interface IGeneratedPDF {
  dosage: MarshallData;
}

const GenerateMarshallDosagePDF = ({ dosage }: IGeneratedPDF) => {
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

  const addHeader = (doc: jsPDF, image: HTMLImageElement) => {
    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);
  };

  const handleAddPage = (doc: jsPDF, image: HTMLImageElement, currentY: number) => {
    const page = doc.getCurrentPageInfo().pageNumber;
    doc.setPage(page + 1);
    doc.addPage();
    addHeader(doc, image);
    if (page >= 3) {
      return (currentY = 30);
    } else {
      return currentY;
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;
    let currentY = 30;

    addCapa(doc, image, dosage.generalData.name);
    handleAddPage(doc, image, currentY);

    const summaryItems: SummaryItem[] = [
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

    const volumetricMechanicParams = [
      {
        label: t('asphalt.dosages.optimum-binder'),
        value: dosage.optimumBinderContentData.optimumBinder.optimumContent.toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.dmt'),
        value: dosage?.confirmationCompressionData.confirmedSpecificGravity?.result.toFixed(2).toString(),
        unity: 'g/cm³',
      },
      {
        label: t('asphalt.dosages.gmb'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity
          .toFixed(2)
          .toString(),
        unity: 'g/cm³',
      },
      {
        label: t('asphalt.dosages.vv'),
        value: (
          dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100
        ).toFixed(2),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.vam'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.voidsFilledAsphalt
          .toFixed(2)
          .toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.rbv') + ' (RBV)',
        value: (
          dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100
        ).toFixed(2),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.marshall-stability'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.stability
          .toFixed(2)
          .toString(),
        unity: 'N',
      },
      {
        label: t('asphalt.dosages.fluency'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.fluency.toFixed(2).toString(),
        unity: 'mm',
      },
      {
        label: t('asphalt.dosages.indirect-tensile-strength'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.indirectTensileStrength
          .toFixed(2)
          .toString(),
        unity: 'MPa',
      },
    ];

    calculatePageNumber(doc);

    addSummary(doc, image, summaryItems);

    handleAddPage(doc, image, currentY);

    doc.setFontSize(12);
    doc.text(`Relatório de Dosagem - ${dosage.generalData.name}`, doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 30; // 60

    // Adicionar informações do usuário
    doc.setFontSize(10);
    doc.text(`Gerado por: ${user.name}`, 10, 40);
    doc.text(`Email: ${user.email}`, 10, 45);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 50);

    // Adicionar resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:', 10, currentY);
    currentY += 10; // 70

    // Exemplo de tabela com autoTable
    const materials = dosage?.materialSelectionData?.aggregates?.map((material) => material.name) || [];

    const optimumBinder =
      dosage?.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.map((confirmedPercentsOfDosage) =>
        confirmedPercentsOfDosage.toFixed(2)
      ) || [];

    materials.push(t('asphalt.dosages.optimum-binder'));

    optimumBinder.push(dosage.optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2));

    doc.setFontSize(12);
    doc.text(
      t('asphalt.dosages.marshall.materials-final-proportions'),
      doc.internal.pageSize.getWidth() / 2,
      currentY,
      {
        align: 'center',
      }
    );
    currentY += 10; // 80

    autoTable(doc, {
      head: [materials],
      body: [optimumBinder],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: currentY,
    });

    currentY += 30; // 110

    //Quantitativos

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.marshall.asphalt-mass-quantitative'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });
    currentY += 10; // 120

    const quantitative =
      dosage?.confirmationCompressionData?.confirmedVolumetricParameters?.quantitative.map(
        (confirmedPercentsOfDosage) => confirmedPercentsOfDosage.toFixed(2)
      ) || [];

    const segundaTabelaConfig = {
      head: [materials],
      body: [quantitative],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, segundaTabelaConfig);

    currentY += 30; // 150

    // Parametros volumétricos
    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.binder-volumetric-mechanic-params'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 10; // 160

    for (let i = 0; i < volumetricMechanicParams.length; i++) {
      doc.text(`${volumetricMechanicParams[i].label}: ${volumetricMechanicParams[i].value} %`, 10, currentY);
      currentY += 5;
    }

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

    currentY += 10;

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.marshall.asphalt-mass-quantitative'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 10;

    const volumetricParamsTable = {
      head: [headers],
      body: volumetricParamsRows,
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, volumetricParamsTable);

    calculatePageNumber(doc);

    // Volumetric params table

    // Adicione uma nova página ao documento
    currentY = handleAddPage(doc, image, currentY);

    // Vazios do agregado mineral

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.vam'), doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    currentY += 10;

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
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, mineralAgregateVoidsTable);

    calculatePageNumber(doc);

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
        <Box onClick={dosage?.confirmationCompressionData && generatePDF} sx={{ width: 'fit-content' }}>
          <Button variant="contained" color="primary" disabled={!dosage?.confirmationCompressionData}>
            Gerar PDF
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GenerateMarshallDosagePDF;
