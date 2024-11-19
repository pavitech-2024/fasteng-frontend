import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import useAuth from '@/contexts/auth';
import { RowsObj } from '@/components/asphalt/dosages/marshall/step-9.marshall';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';

interface IGeneratedPDF {
  dosages: MarshallData;
}

const GenerateDosagePDF = ({ dosages }: IGeneratedPDF) => {
  const { user } = useAuth();

  const generatePDF = async () => {
    console.log('🚀 ~ GenerateDosagePDF ~ dosages:', dosages);
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
    doc.text(`Quantitativo para 1 metro cúbico de massa asfáltica`, pageWidth / 2, 130, { align: 'center' });

    const quantitative =
      dosages?.confirmationCompressionData?.confirmedVolumetricParameters?.quantitative.map(
        (confirmedPercentsOfDosage) => confirmedPercentsOfDosage.toFixed(2)
      ) || [];
      console.log("🚀 ~ generatePDF ~ dosages?.confirmationCompressionData?.confirmedVolumetricParameters?.quantitative:", dosages)


    const segundaTabelaConfig = {
      head: [materials],
      body: [quantitative],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      startY: 150, // Posição vertical do segundo table
    };

    autoTable(doc, segundaTabelaConfig);

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
