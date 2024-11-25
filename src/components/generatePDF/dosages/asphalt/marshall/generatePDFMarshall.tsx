import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import { Box, Button, Tooltip } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import logo from '@/assets/fasteng/LogoBlack.png';
import { SummaryItem } from '../../../materials/asphalt/generatePDFAsphalt/generatePDFAsphalt';
import { addCapa, addCenteredText, addImageProcess,calculatePageNumber } from '../../../common';

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

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    addCapa(doc, image, dosage.generalData.name);
    doc.addPage();

    addHeader(doc, image);

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

    calculatePageNumber(doc);

    doc.setPage(2);
    addSummary(doc, image, summaryItems);

    doc.addPage();

    doc.setFontSize(12);
    doc.text(`Relatório de Dosagem - ${dosage.generalData.name}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Adicionar informações do usuário
    doc.setFontSize(10);
    doc.text(`Gerado por: ${user.name}`, 10, 40);
    doc.text(`Email: ${user.email}`, 10, 45);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 50);

    // Adicionar resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:', 10, 60);

    // Exemplo de tabela com autoTable
    const materials = dosage?.materialSelectionData?.aggregates?.map((material) => material.name) || [];

    const optimumBinder =
      dosage?.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.map((confirmedPercentsOfDosage) =>
        confirmedPercentsOfDosage.toFixed(2)
      ) || [];

    materials.push(t('asphalt.dosage.optimum-binder'));

    optimumBinder.push(dosage.optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2));

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.marshall.materials-final-proportions'), doc.internal.pageSize.getWidth() / 2, 90, { align: 'center' });

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
    doc.text(t('asphalt.dosages.marshall.asphalt-mass-quantitative'), doc.internal.pageSize.getWidth() / 2, 140, { align: 'center' });

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
      startY: 150, // Posição vertical do segundo table
    };

    autoTable(doc, segundaTabelaConfig);

    // Parametros volumétricos
    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.binder-volumetric-mechanic-params'), doc.internal.pageSize.getWidth() / 2, 190, {
      align: 'center',
    });

    doc.text(
      `${t('asphalt.dosage.optimum-binder')}: ${dosage.optimumBinderContentData.optimumBinder.optimumContent.toFixed(
        2
      )} %`,
      10,
      200
    );

    doc.text(
      `${t('asphalt.dosage.dmt')}: ${dosage.confirmationCompressionData.confirmedSpecificGravity?.result.toFixed(
        2
      )} g/cm³`,
      10,
      205
    );

    doc.text(
      `${t(
        'asphalt.dosage.gmb'
      )}: ${dosage.confirmationCompressionData.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity.toFixed(
        2
      )} g/cm³`,
      10,
      210
    );

    doc.text(
      `${t('asphalt.dosage.vv')}: ${(
        dosage.confirmationCompressionData.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100
      ).toFixed(2)} %`,
      10,
      215
    );

    doc.text(
      `${t(
        'asphalt.dosage.vam'
      )}: ${dosage.confirmationCompressionData.confirmedVolumetricParameters?.values?.voidsFilledAsphalt.toFixed(
        2
      )} %`,
      10,
      220
    );

    doc.text(
      `${t('asphalt.dosage.rbv') + ' (RBV)'}: ${(
        dosage.confirmationCompressionData?.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100
      ).toFixed(2)} %`,
      10,
      225
    );

    doc.text(
      `${t(
        'asphalt.dosage.marshall-stability'
      )}: ${dosage.confirmationCompressionData.confirmedVolumetricParameters?.values?.stability.toFixed(2)} N`,
      10,
      230
    );

    doc.text(
      `${t(
        'asphalt.dosage.fluency'
      )}: ${dosage.confirmationCompressionData.confirmedVolumetricParameters?.values?.fluency.toFixed(2)} MPa`,
      10,
      235
    );

    calculatePageNumber(doc);

    doc.setPage(3);

    // Volumetric params table

    // Adicione uma nova página ao documento
    doc.addPage();

    const headers = [
      t('asphalt.dosage.marshall.parameter'),
      t('asphalt.dosage.marshall.unity'),
      t('asphalt.dosage.marshall.bearing-layer'),
      t('asphalt.dosage.marshall.bonding-layer'),
    ];

    const volumetricParamsRows = [
      [t('asphalt.dosage.stability'), 'Kgf', '>=500', '>=500'],
      [t('asphalt.dosage.rbv'), '%', '75 - 82', '65 - 72'],
      [t('asphalt.dosage.mixture-voids'), '%', '3 - 5', '4 - 6'],
      [`${t('asphalt.dosage.indirect-tensile-strength')}` + ` (25 °C)`, 'MPa', '>= 0,65', '>= 0,65'],
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
    doc.text(`Quantitativo para 1 metro cúbico de massa asfáltica`, doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

    autoTable(doc, volumetricParamsTable);

    // Vazios do agregado mineral

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.vam'), doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });

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

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosage.superpave.tooltips.disabled-pdf-generator')} placement="top">
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