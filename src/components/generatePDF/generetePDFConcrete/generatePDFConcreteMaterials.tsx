import { EssaysData } from '@/pages/concrete/materials/material/[id]';
import jsPDF from 'jspdf';
import React from 'react';
import logo from '../../../assets/fasteng/LogoBlack.png';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { Button } from '@mui/material';

interface SummaryItem {
  title: string;
  page: number;
}

export interface IGenratePDFConcreteMaterials {
    name: string;
    type: string;
    granulometryData: EssaysData['concreteGranulometryData'];
    chapmanData: EssaysData['chapmanData'];
    sandIncreaseData: EssaysData['sandIncreaseData'];
    unitMassData: EssaysData['unitMassData'];
}

const GeneratePDFConcreteMaterials = ({
    name,
    type,
    granulometryData,
    chapmanData,
    sandIncreaseData,
    unitMassData
}: IGenratePDFConcreteMaterials) => {

    const { user } = useAuth();

    const dataGranulometryData = {
        container_other_data: [],
    };

    const {
      preferences: { decimal: user_decimal },
    } = user;

    const newArray = [];

    //const dataSandIncreaseData = [];

    //const unitMassResult = Number(unitMassData.result).toFixed(1);

    //chapmanData.results.m_e.toFixed(user_decimal)

    const granulometryRows = [];
    const granulometryColumns = [
      t('granulometry-asphalt.sieves'),
      t('granulometry-asphalt.passant') + ' (%)',
      t('granulometry-asphalt.passant') + ' (g)',
      t('granulometry-asphalt.retained') + ' (%)',
      t('granulometry-asphalt.retained') + ' (g)',
      t('granulometry-asphalt.accumulated-retained') + ' (%)',
    ];

    let sandIncreaseDataRows = [];
    const sandIncreaseDataColumns = [
      t('sandIncrease.samples'),
      t('sandIncrease.unitMass'),
      t('sandIncrease.moistureContent') + ' encontrado (%)',
      t('sandIncrease.swellings')

    ];

    if (granulometryData) {
        dataGranulometryData.container_other_data.push(
          { label: t('granulometry-concrete.total-retained'), value: granulometryData.results.total_retained, unity: 'g' },
          { label: t('granulometry-concrete.nominal-size'), value: granulometryData.results.nominal_size, unity: 'mm' },
          {
            label: t('granulometry-concrete.nominal-diameter'),
            value: granulometryData.results.nominal_diameter,
            unity: 'mm',
          },
          {
            label: t('granulometry-concrete.fineness-module'),
            value: granulometryData.results.fineness_module,
            unity: '%',
          },
          { label: t('granulometry-concrete.cc'), value: granulometryData.results.cc },
          { label: t('granulometry-concrete.cnu'), value: granulometryData.results.cnu },
          { label: t('granulometry-concrete.error'), value: granulometryData.results.error, unity: '%' }
        );
        granulometryData.step2Data.table_data.map((value, index) => {
          granulometryRows.push({
            sieve: value.sieve,
            passant_porcentage: value.passant,
            passant: granulometryData.results.passant[index],
            retained_porcentage: granulometryData.results.retained_porcentage[index],
            retained: value.retained,
            accumulated_retained: granulometryData.results.accumulated_retained[index],
          });
        });
    };

    if(sandIncreaseData){
      for (let i = 0; i < sandIncreaseData.results.unitMasses.length; i++) {
        const sampleNumber = (i + 1).toString();
    
        const newObj = {
          sample: sampleNumber,
          moistureContent: sandIncreaseData.results.moistureContent[i].toFixed(2),
          swellings: sandIncreaseData.results.swellings[i].toFixed(2),
          unitMass: sandIncreaseData.results.unitMasses[i],
        };
    
        newArray.push(newObj);
      }

      sandIncreaseDataRows = newArray;
    }

    const sections = [
      {
        condition: granulometryData,
        title: t('asphalt.essays.granulometry'),
        content: async (doc, currentY) => {
          if(dataGranulometryData.container_other_data.length > 0){
            dataGranulometryData.container_other_data.forEach((item) => {
              addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
              currentY += 5;
            });
          }
          const chart = document.getElementById('chart-div-granulometry-concrete');
          if (chart) {
            return addChart(chart, doc, currentY);
          }
          if(granulometryRows.length > 0){
            addTable(doc, granulometryRows, granulometryColumns, currentY);
            const tableHeight = (doc as any).lastAutoTable.finalY - currentY;
            currentY += tableHeight + 5;
          }
          return currentY;
        }
      },
      {
        condition: chapmanData,
        title: t('concrete.essays.coarseAggregate'),
        content: async (doc, currentY) => {
          addTextToLeftMargin(doc, t('results'), 10, currentY, 14);
          currentY += 5;
          addTextToLeftMargin(doc, `M.E: ${chapmanData.results.m_e.toFixed(user_decimal)} kg/L`, 10, currentY);
          return currentY + 5;
        }
      },
      {
        condition: sandIncreaseData,
        title: t('concrete.essays.sandIncrease'),
        content: async (doc, currentY) => {
          addTable(doc, sandIncreaseDataRows, sandIncreaseDataRows, currentY);
          const tableHeight = (doc as any).lastAutoTable.finalY - currentY;
          currentY += tableHeight + 5;
          addTextToLeftMargin(doc, `${t('sandIncrease.averageCoefficient')}: ${sandIncreaseData.results?.averageCoefficient?.toFixed(3).toString()}`, 10, currentY);
          currentY += 5;
          addTextToLeftMargin(doc, `${t('sandIncrease.criticalHumidity')}: ${sandIncreaseData.results?.criticalHumidity?.toFixed(3).toString()}`, 10, currentY);
          currentY += 5;
          const chart = document.getElementById('chart-div-sand-increase-material');
          if (chart) {
            return addChart(chart, doc, currentY);
          }
          return currentY + 5;
        }
      },
    ]

    const calculatePageNumber = (doc: any) => {
      const totalPages = doc.internal.pages.length;
      for (let pageNumber = 1; pageNumber < totalPages; pageNumber++) {
        doc.setPage(pageNumber);
        addPageNumber(doc, pageNumber);
      }
    };
  
    const addPageNumber = (doc: any, pageNumber: number) => {
      const pageHeight = doc.internal.pageSize.height;
      const lineYPosition = pageHeight - 10;
  
      doc.setLineWidth(0.5);
      doc.line(10, lineYPosition, 200, lineYPosition);
      addCenteredText(doc, `${pageNumber}`, lineYPosition + 5, 10);
    };
  
    const addCenteredText = (doc: any, text: any, y: any, fontSize: number = 24) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      doc.setFontSize(fontSize);
      doc.text(x, y, text);
    };
  
    const addTextToRightMargin = (doc: any, text: string, blockWidth: number, y: number, padding: number = 5) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const x = pageWidth - blockWidth;
  
      let lines = [];
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
  
    const addTextToLeftMargin = (doc: any, text: any, margin: any, y: any, fontSize: number = 12) => {
      const x = margin;
      doc.setFontSize(fontSize);
      doc.text(x, y, text);
    };
    const addImageProcess = async (src: string) => {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    };
  
    const addTable = (doc: any, rows: any, header: string[], height: number) => {
      autoTable(doc, {
        head: [header],
        body: rows.map((row) => Object.values(row)),
        startY: height,
        theme: 'striped',
      });
    };
  
    const addChart = async (chart: any, doc: any, currentY: number) => {
      const canvas = await html2canvas(chart);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const xPosition = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;
      doc.addImage(imgData, 'PNG', xPosition, currentY, pdfWidth, pdfHeight);
      return (currentY += pdfHeight + 5);
    };
  
    const getCurrentDateFormatted = (): string => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
  
      return `${day}/${month}/${year}`;
    };
  
    const addSummary = (doc: jsPDF, image: HTMLImageElement, summaryItems: SummaryItem[]) => {
      let currentY = 30;
  
      doc.addImage(image, 'png', 5, 5, 50, 8);
      doc.addImage(image, 'png', 155, 5, 50, 8);
  
      addCenteredText(doc, `${t('asphalt.essays.project.summary')}`, currentY, 16);
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
  
    const addCapa = (doc: any, logo: any, nomeProjeto: string, nomeMaterial: string) => {
      doc.addImage(logo, 'png', 5, 5, 50, 8);
      doc.addImage(logo, 'png', 155, 5, 50, 8);
  
      let currentY = 55;
      addCenteredText(doc, `${t('asphalt.essays.project.title')}`, currentY, 16);
      currentY += 20;
      addCenteredText(doc, `${t('asphalt.essays.project.name')}: ${nomeProjeto}`, currentY, 16);
      currentY += 30;
      addTextToRightMargin(doc, `${t('asphalt.essays.project.description.text')} ${nomeMaterial}`, 100, currentY);
  
      const pageHeight = doc.internal.pageSize.height;
      const lineYPosition = pageHeight - 10;
      const dateYPosition = lineYPosition - 5;
  
      const formattedDate = getCurrentDateFormatted();
  
      addCenteredText(doc, formattedDate, dateYPosition, 14);
  
      doc.setLineWidth(0.5);
      doc.line(10, lineYPosition, 200, lineYPosition);
  
      addCenteredText(doc, '1', lineYPosition + 5, 10);
    };

    const generate = async () => {
      const doc = new jsPDF();
      const image = (await addImageProcess(logo.src)) as HTMLImageElement;
  
      addCapa(doc, image, name, type);
      doc.addPage();
  
      doc.addPage();
  
      doc.addImage(image, 'png', 5, 5, 50, 8);
      doc.addImage(image, 'png', 155, 5, 50, 8);
  
      addCenteredText(doc, `${t('general data of essay')}`, 30);
      addTextToLeftMargin(doc, `${t('asphalt.materials.name')}: ${name}`, 10, 40);
      addTextToLeftMargin(doc, `${t('asphalt.materials.type')}: ${type}`, 10, 45);
  
      let currentY = 55;
      const summaryItems: SummaryItem[] = [];
  
      for (const section of sections) {
        if (section.condition) {
          currentY += 5;
          addTextToLeftMargin(doc, section.title, 10, currentY, 14);
          currentY += 5;
          currentY = await section.content(doc, currentY);
          const pageIndex = doc.internal.pages.length - 1;
          summaryItems.push({ title: section.title, page: pageIndex });
        }
      }
  
      calculatePageNumber(doc);
  
      doc.setPage(2);
      addSummary(doc, image, summaryItems);
  
      doc.save('material-concrete.pdf');
    };

    return (
      <div>
        <Button
          sx={{
            fontWeight: 700,
            fontSize: { mobile: '11px', notebook: '13px' },
            bgcolor: 'primaryTons.lightGray',
            width: '100%',
          }}
          onClick={generate}
        >
          Download PDF
        </Button>
      </div>
    );
};

export default GeneratePDFConcreteMaterials;