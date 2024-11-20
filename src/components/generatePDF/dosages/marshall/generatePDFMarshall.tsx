import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';

interface IGeneratedPDF {
  dosages: MarshallData;
}

const GenerateDosagePDF = ({ dosages }: IGeneratedPDF) => {
  const { user } = useAuth();

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const pageWidth = doc.internal.pageSize.getWidth();

    // Adicionando logo ao PDF
    const imgLogo = new Image();
    imgLogo.src = '/assets/fasteng/LogoBlack.png'; // Caminho para o logo
    imgLogo.onload = function () {
      doc.addImage(imgLogo, 'PNG', 10, 10, 50, 20);
    };

    // doc.addImage(imgLogo, 'PNG', 10, 10, 50, 20); // Adiciona logo no topo
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

    // dosages?.forEach((dosage, index) => {
    //   doc.text(`Dosagem ${index + 1}: ${dosage.title}`, 10, 70 + index * 10);
    //   doc.text(`Página: ${dosage.page}`, 10, 75 + index * 10);
    // });

    doc.text(`Dosagem 1: ${dosages?.generalData.name}`, 10, 70);
    doc.text(`Página: ${dosages}`, 10, 75);

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
    doc.text(`Parâmetros volumétricos e mecanicos da mistura no teor ótimo de ligante asfáltico`, pageWidth / 2, 190, { align: 'center' });

    doc.text(`${t("asphalt.dosages.optimum-binder")}: ${dosages.optimumBinderContentData.optimumBinder.optimumContent.toFixed(2)} %`, 10, 200);

    doc.text(`${t("asphalt.dosages.dmt")}: ${dosages.confirmationCompressionData.confirmedSpecificGravity?.result.toFixed(2)} g/cm³`, 10, 205);

    doc.text(`${t("asphalt.dosages.gmb")}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity.toFixed(2)} g/cm³`, 10, 210);

    doc.text(`${t("asphalt.dosages.vv")}: ${(dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100).toFixed(2)} %`, 10, 215);

    doc.text(`${t("asphalt.dosages.vam")}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.voidsFilledAsphalt.toFixed(2)} %`, 10, 220);

    doc.text(`${t("asphalt.dosages.rbv") + " (RBV)"}: ${(dosages.confirmationCompressionData?.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100).toFixed(2)} %`, 10, 225);

    doc.text(`${t("asphalt.dosages.marshall-stability")}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.stability.toFixed(2)} N`, 10, 230);

    doc.text(`${t("asphalt.dosages.fluency")}: ${dosages.confirmationCompressionData.confirmedVolumetricParameters?.values?.fluency.toFixed(2)} MPa`, 10, 235);

    // Seções adicionais
    // Exemplo de adicionar gráficos ou outros dados
    const chartElement = document.getElementById('chart-div');
    if (chartElement) {
      const chartCanvas = await html2canvas(chartElement);
      const chartImage = chartCanvas.toDataURL('image/png');
      // doc.addImage(chartImage, 'PNG', 10, doc?.lastAutoTable.finalY + 10, 180, 90);
    }

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
