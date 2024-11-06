import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';
import useAuth from '@/contexts/auth';

const GenerateDosagePDF = ({ dosageData }: any) => {
  const { user } = useAuth();

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');

    const pageWidth = doc.internal.pageSize.getWidth();

    // Adicionando logo ao PDF
    const imgLogo = new Image();
    imgLogo.src = '/path/to/logo.png'; // Caminho para o logo

    doc.addImage(imgLogo, 'PNG', 10, 10, 50, 20); // Adiciona logo no topo
    doc.setFontSize(12);
    doc.text(`Relatório de Dosagem - ${dosageData.name}`, pageWidth / 2, 30, { align: 'center' });

    // Adicionar informações do usuário
    doc.setFontSize(10);
    doc.text(`Gerado por: ${user.name}`, 10, 40);
    doc.text(`Email: ${user.email}`, 10, 45);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 50);

    // Adicionar resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:', 10, 60);

    dosageData.forEach((dosage, index) => {
      doc.text(`Dosagem ${index + 1}: ${dosage.title}`, 10, 70 + index * 10);
      doc.text(`Página: ${dosage.page}`, 10, 75 + index * 10);
    });

    // Exemplo de tabela com autoTable
    autoTable(doc, {
      head: [['Componente', 'Quantidade']],
      body: dosageData.map((item) => [item.component, item.quantity]),
      startY: 100,
    });

    // Seções adicionais
    // Exemplo de adicionar gráficos ou outros dados
    const chartElement = document.getElementById('chart-div');
    if (chartElement) {
      const chartCanvas = await html2canvas(chartElement);
      const chartImage = chartCanvas.toDataURL('image/png');
      // doc.addImage(chartImage, 'PNG', 10, doc?.lastAutoTable.finalY + 10, 180, 90);
    }

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosageData.name}.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="contained" color="primary">
      Gerar PDF
    </Button>
  );
};

export default GenerateDosagePDF;
