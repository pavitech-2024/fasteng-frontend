import { t } from 'i18next';

export const addImageProcess = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const addCenteredText = (doc: any, text: any, y: any, fontSize = 24) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
  const x = (pageWidth - textWidth) / 2;
  doc.setFontSize(fontSize);
  doc.text(x, y, text);
};

export const addTextToRightMargin = (doc: any, text: string, blockWidth: number, y: number, padding = 10) => {
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

export const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

export const addPageNumber = (doc: any, pageNumber: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const lineYPosition = pageHeight - 10;

  doc.setLineWidth(0.5);
  doc.line(10, lineYPosition, 200, lineYPosition);
  addCenteredText(doc, `${pageNumber}`, lineYPosition + 5, 10);
};

export const calculatePageNumber = (doc: any) => {
  const totalPages = doc.internal.pages.length;
  for (let pageNumber = 1; pageNumber < totalPages; pageNumber++) {
    if (pageNumber > 1) {
      doc.setPage(pageNumber);
      addPageNumber(doc, pageNumber);
    }
  }
};

export const addCapa = (doc: any, logo: any, dosageName: string, materialName?: string) => {
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

export const addTextToLeftMargin = (doc: any, text: any, margin: any, y: any, fontSize = 12) => {
  const x = margin;
  doc.setFontSize(fontSize);
  doc.text(x, y, text);
};