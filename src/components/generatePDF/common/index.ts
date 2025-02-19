import { t } from 'i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface SummaryItem {
  title: string;
  page: number;
}

// const dosageDescription = {
//   ['marshall']: t('asphalt.dosages.marshall.project.description.text'),
//   ['superpave']: t('asphalt.dosages.superpave.project.description.text'),
//   ['abcp']: t('asphalt.dosages.abcp.project.description.text'),
// };

export const addHeader = (doc: jsPDF, image: HTMLImageElement) => {
  doc.addImage(image, 'png', 5, 5, 50, 8);
  doc.addImage(image, 'png', 155, 5, 50, 8);
};

export const addChart = async (chartElement: HTMLDivElement, doc: jsPDF, currentY: number) => {
  const canvas = await html2canvas(chartElement);
  const imgData = canvas.toDataURL('image/png');
  const imgProps = doc.getImageProperties(imgData);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  const xPosition = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;
  doc.addImage(imgData, 'PNG', xPosition, currentY, pdfWidth, pdfHeight);
};

export const addSummary = (
  doc: jsPDF,
  image: HTMLImageElement,
  summaryItems: SummaryItem[],
  binder: string,
  aggregates: any,
  dosageType: string
) => {
  let currentY = 30;
  let currentX = 10;

  doc.addImage(image, 'png', 5, 5, 50, 8);
  doc.addImage(image, 'png', 155, 5, 50, 8);

  addCenteredText(doc, `${t('asphalt.essays.project.summary')}`, currentY, 12);
  currentY += 20;
  let page = 3;

  summaryItems.forEach((item, idx) => {
    const title = item.title;
    const externalNumber = idx + 1;
    const totalWidth = 190;

    let internalNumber = 1;
    let titleWidth = doc.getTextWidth(title);
    let lineWidth = totalWidth - (titleWidth + 2);
    let lineLength = Math.floor(lineWidth / doc.getTextWidth('_'));
    let line = '_'.repeat(lineLength - 10);

    doc.text(externalNumber + '. ' + title, currentX, currentY);
    doc.text(line, 10 + titleWidth + currentX, currentY);

    doc.text(page.toString(), totalWidth, currentY);

    page += 1;
    currentY += 10;

    const previousCurrentX = currentX;

    if (idx == 1) {
      currentX += 10;

      titleWidth = doc.getTextWidth(`${externalNumber + '.' + internalNumber + ' ' + binder}`);
      lineWidth = totalWidth - (titleWidth - currentX) - 7.5;
      lineLength = Math.floor(lineWidth / doc.getTextWidth('_'));
      line = '_'.repeat(lineLength - currentX);

      doc.text(externalNumber + '.' + internalNumber + '. ' + binder, currentX, currentY);
      doc.text(line, currentX + titleWidth + 10, currentY);

      if (currentX !== 10) {
        page -= 1;
      }

      doc.text(page.toString(), totalWidth, currentY);

      page += 1;
      internalNumber++;
      currentY += 10;

      titleWidth = doc.getTextWidth('Agregados');
      lineWidth = totalWidth - (titleWidth - currentX) - 7;
      lineLength = Math.floor(lineWidth / doc.getTextWidth('_'));
      line = '_'.repeat(lineLength - currentX);

      doc.text(externalNumber + '.' + internalNumber + '. ' + 'Agregados', currentX, currentY);
      doc.text(line, currentX + titleWidth + 10, currentY);
      doc.text(page.toString(), totalWidth, currentY);

      page += 1;
      internalNumber++;
      currentY += 10;
      currentX += 10;

      let newPage = false;

      for (let i = 0; i < aggregates.length; i++) {
        titleWidth = doc.getTextWidth(aggregates[i].name);
        lineWidth = totalWidth - (titleWidth + currentX) - 7;
        lineLength = Math.floor(lineWidth / doc.getTextWidth('_'));
        line = '_'.repeat(lineLength);
        const aggregate = aggregates[i];

        doc.text(aggregate.name, currentX, currentY);
        doc.text(line, currentX + titleWidth + 5, currentY);

        if (currentX !== 10 && !newPage) {
          page -= 1;
          newPage = true;
        }

        doc.text(page.toString(), totalWidth, currentY);

        page += 1;
        currentY += 10;
      }
    }

    currentX = previousCurrentX;
  });

  const pageHeight = doc.internal.pageSize.height;
  const lineYPosition = pageHeight - 10;

  doc.setLineWidth(0.5);
  doc.line(10, lineYPosition, 200, lineYPosition);

  calculatePageNumber(doc, dosageType);
};

export const handleAddPage = (doc: jsPDF, image: HTMLImageElement, currentY: number, dosageType: string) => {
  const page = doc.getCurrentPageInfo().pageNumber;
  doc.setPage(page + 1);
  doc.addPage();
  calculatePageNumber(doc, dosageType);
  addHeader(doc, image);
  if (page >= 3) {
    return (currentY = 30);
  } else {
    return currentY;
  }
};

export const addImageProcess = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const addCenteredText = (doc: any, text: any, y: any, fontSize = 24) => {
  const upperCaseText = text.toUpperCase();
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = (doc.getStringUnitWidth(upperCaseText) * fontSize) / doc.internal.scaleFactor;
  const x = (pageWidth - textWidth) / 2;
  doc.setFontSize(fontSize);
  doc.text(x, y, upperCaseText);
};

export const addTextToRightMargin = (doc: jsPDF, text: string, blockWidth: number, y: number, padding = 10) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const x = pageWidth - blockWidth;
  let biggestLine = 0;

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
    const testWidth = (doc.getStringUnitWidth(testLine) * doc.getFontSize()) / doc.internal.scaleFactor;

    if (testWidth > blockWidth - 2 * padding) {
      addLine(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  addLine(currentLine);

  lines.forEach((line, index) => {
    const lineWidth = (doc.getStringUnitWidth(line) * doc.getFontSize()) / doc.internal.scaleFactor;

    if (lineWidth > biggestLine) {
      biggestLine = lineWidth;
    }

    doc.text(line, x, y + index * 5, { align: 'justify' });
  });
};

export const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDate = (date: string): string => {
  const dateObject = new Date(date);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();
  return `${day}/${month}/${year}`;
};

export const addPageNumber = (doc: jsPDF, pageNumber: number, dosageType: string) => {
  const pageHeight = doc.internal.pageSize.height;
  const lineYPosition = pageHeight - 10;

  doc.setLineWidth(0.5);
  doc.line(10, lineYPosition, 200, lineYPosition);
  addCenteredText(doc, `${pageNumber}`, lineYPosition + 5, 10);
  addTextToLeftMargin(doc, dosageType, 10, lineYPosition + 5, 10);
};

export const calculatePageNumber = (doc: any, dosageType: string) => {
  const totalPages = doc.internal.pages.length;
  for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
    if (pageNumber > 0) {
      doc.setPage(pageNumber);
      addPageNumber(doc, pageNumber, dosageType);
    }
  }
};

export const addCapa = (
  doc: any,
  logo: any,
  projectType: string,
  projectDate: string,
  projectName: string,
  projectAuthor: string,
  laboratory: string
) => {
  const dateParts = projectDate.split('T')[0].split('-');
  const formattedDosageDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

  const dosageDescription = {
    ['marshall']: t('asphalt.dosages.marshall.project.description.text'),
    ['superpave']: t('asphalt.dosages.superpave.project.description.text'),
    ['abcp']: t('asphalt.dosages.abcp.project.description.text'),
  };

  doc.addImage(logo, 'png', 5, 5, 50, 8);
  doc.addImage(logo, 'png', 155, 5, 50, 8);

  let currentY = 55;
  addCenteredText(doc, `${t('asphalt.pdf.project-title') + ' ' + projectType}`, currentY, 12);
  currentY += 30;
  addCenteredText(doc, `${t('asphalt.pdf.project-date') + ': ' + formattedDosageDate}`, currentY, 12);
  currentY += 5;
  addCenteredText(doc, `${t('asphalt.essays.project.name') + ': ' + projectName}`, currentY, 12);
  currentY += 30;

  if (projectAuthor) {
    addCenteredText(doc, `${t('asphalt.essays.project.author').toUpperCase() + ': ' + projectAuthor}`, currentY, 12);
    currentY += 30;
  }

  if (laboratory) {
    addCenteredText(doc, `${t('asphalt.essays.project-laboratory').toUpperCase() + ': ' + laboratory}`, currentY, 12);
    currentY += 30;
  }

  addTextToRightMargin(doc, `${dosageDescription[projectType]}`, 100, currentY);

  const pageHeight = doc.internal.pageSize.height;
  const lineYPosition = pageHeight - 10;
  const dateYPosition = lineYPosition - 5;

  const formattedDate = getCurrentDateFormatted();

  addCenteredText(doc, formattedDate, dateYPosition, 12);
};

export const addTextToLeftMargin = (doc: any, text: any, margin: any, y: any, fontSize = 12) => {
  const x = margin;
  doc.setFontSize(fontSize);
  doc.text(x, y, text);
};

export const addSection = async (sectionElement: HTMLDivElement, doc: jsPDF, currentY: number): Promise<number> => {
  if (!sectionElement) return currentY;

  const canvas = await html2canvas(sectionElement);
  const imgData = canvas.toDataURL('image/png');
  const imgProps = doc.getImageProperties(imgData);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  const pageHeight = doc.internal.pageSize.getHeight();
  const xPosition = (doc.internal.pageSize.getWidth() - pdfWidth) / 2;

  if (currentY + pdfHeight > pageHeight - 10) {
    doc.addPage();
    currentY = 5;
  }

  doc.addImage(imgData, 'PNG', xPosition, currentY, pdfWidth, pdfHeight);

  return currentY + pdfHeight + 5;
};
