import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';

export const generatePDF = (material: { material: { name: string; type: string; }; essays: { essayName: string; data: EssaysData }[] }, type: string) => {
 /** 
  const doc = new jsPDF();

  doc.text('Relatório de Material Asfáltico', 10, 10);
  doc.text(`Nome: ${material?.material.name}`, 10, 20);
  doc.text(`Tipo: ${type}`, 10, 30);

  const granulometryData = material.essays.find(essay => essay.essayName === 'granulometry')?.data.asphaltGranulometryData.results;
  if (granulometryData) {
    const granulometryTable = granulometryData.map((result, index) => [
      index + 1,
      result.size,
      result.percentage
    ]);

    doc.autoTable({
      head: [['#', 'Tamanho', 'Percentagem']],
      body: granulometryTable,
      startY: 40,
      theme: 'striped'
    });
  }

  doc.save('relatorio-material.pdf');
  */
};
