import jsPDF from 'jspdf';
import React from 'react';
import autoTable from 'jspdf-autotable';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';
import html2canvas from 'html2canvas';
import { t } from 'i18next';
import { Box, Button } from '@mui/material';
import useAuth from '@/contexts/auth';
import { handleAddPage, SummaryItem } from '@/components/generatePDF/common';
import logo from '@/assets/fasteng/LogoBlack.png';

export interface IGenratePDF {
  name: string;
  type: string;
  granulometryData: EssaysData['asphaltGranulometryData'];
  specificMassData: EssaysData['specifyMassData'];
  shapeIndexData: EssaysData['shapeIndexData'];
  elongatedParticlesData: EssaysData['elongatedParticlesData'];
  adhesivenessData: EssaysData['adhesivenessData'];
  losAngelesAbrasionData: EssaysData['losAngelesAbrasionData'];
  sandEquivalentData: EssaysData['sandEquivalentData'];
  angularityData: EssaysData['angularityData'];
  viscosityRotationalData: EssaysData['viscosityRotationalData'];
  penetrationData: EssaysData['penetrationData'];
  softeningPointData: EssaysData['softeningPointData'];
  flashPointData: EssaysData['flashPointData'];
  ductilityData: EssaysData['ductilityData'];
  rtfoData: EssaysData['rtfoData'];
  elasticRecoveryData: EssaysData['elasticRecoveryData'];
}

const GeneratePDF = ({
  name,
  type,
  granulometryData,
  specificMassData,
  shapeIndexData,
  elongatedParticlesData,
  adhesivenessData,
  losAngelesAbrasionData,
  sandEquivalentData,
  angularityData,
  viscosityRotationalData,
  penetrationData,
  softeningPointData,
  flashPointData,
  ductilityData,
  rtfoData,
  elasticRecoveryData,
}: IGenratePDF) => {
  const { user } = useAuth(); // Obtendo o usuário
  //----------------------------------------datas------------------------------------------------------------------------------
  const dataSpecificMass = {
    specificMassContainer: [],
    shapeIndexContainer: [],
  };
  const dataShape = {
    shapeIndexContainer: [],
  };
  const dataAngularity = {
    container_other_data: [],
  };
  const dataFlash = {
    container_other_data: [],
  };
  const dataDuctility = {
    container_other_data: [],
  };
  const dataElastic = {
    container_other_data: [],
  };
  let dataLosAngeles;
  let dataSand;
  let filmDisplacement;
  let dataViscosity;
  let dataPenetration;
  let dataSoftening;
  let dataRtfo;

  //---------------------------------------------Rows&Cols------------------------------------------------------

  const granulometryColumns = [
    t('granulometry-asphalt.sieves'),
    t('granulometry-asphalt.passant') + ' (%)',
    t('granulometry-asphalt.passant') + ' (g)',
    t('granulometry-asphalt.retained') + ' (%)',
    t('granulometry-asphalt.retained') + ' (g)',
    t('granulometry-asphalt.accumulated-retained') + ' (%)',
  ];
  const elongatedParticlesColumns = [t('elongatedParticles.ratio'), t('elongatedParticles.particles-percentage')];
  const angularityColumns = ['', t('angularity.angularity')];
  const rtfoColumns = [t('rtfo.weight-loss')];

  const granulometryRows = [];
  const granulometryResults = [];
  let elongatedParticlesRows;
  const angularityRows = [];
  let rtfoRows;
  //---------------------------------------Loading Data---------------------------------

  if (adhesivenessData) {
    filmDisplacement = adhesivenessData.results.filmDisplacement
      ? t('adhesiveness.filmDisplacement-true')
      : t('adhesiveness.filmDisplacement-false');
  }

  if (granulometryData?.results.graph_data) {
    granulometryData.step2Data.table_data.map((value, index) => {
      granulometryRows.push({
        sieve: value.sieve_label,
        passant_porcentage: value.passant,
        passant: granulometryData.results.passant[index][1],
        retained_porcentage: granulometryData.results.retained_porcentage[index][1],
        retained: value.retained,
        accumulated_retained: granulometryData.results.accumulated_retained[index][1],
      });
    });

    granulometryResults.push(
      {
        label: t('granulometry-asphalt.total-retained'),
        value: granulometryData.results.total_retained,
        unity: 'g',
      },
      {
        label: t('asphalt.essays.granulometry.results.nominalSize'),
        value: granulometryData.results.nominal_size,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.nominalDiammeter'),
        value: granulometryData.results.nominal_diameter,
        unity: 'mm',
      },
      {
        label: t('asphalt.essays.granulometry.results.finenessModule'),
        value: granulometryData.results.fineness_module,
        unity: '%',
      },
      {
        label: t('granulometry-asphalt.cc'),
        value: granulometryData.results.cc,
        unity: '',
      },
      {
        label: t('granulometry-asphalt.cnu'),
        value: granulometryData.results.cnu,
        unity: '',
      },
      {
        label: t('granulometry-asphalt.error'),
        value: granulometryData.results.error,
        unity: '%',
      }
    );
  }

  if (elongatedParticlesData) {
    elongatedParticlesRows = elongatedParticlesData?.results.results_dimensions_table_data;
  }

  if (specificMassData) {
    dataSpecificMass.specificMassContainer.push(
      { label: t('specifyMass.bulk_specify_mass'), value: specificMassData.results.bulk_specify_mass, unity: 'g/cm³' },
      {
        label: t('specifyMass.apparent_specify_mass'),
        value: specificMassData.results.apparent_specify_mass,
        unity: 'g/cm³',
      },
      { label: t('specifyMass.absorption'), value: specificMassData.results.absorption, unity: '%' }
    );
  }

  if (shapeIndexData) {
    dataShape.shapeIndexContainer.push({
      label: t('shapeIndex.shapeIndex'),
      value: shapeIndexData.results.shape_index,
      unity: '',
    });
  }

  if (losAngelesAbrasionData) {
    dataLosAngeles = {
      losAngelesAbrasion: losAngelesAbrasionData.results.losAngelesAbrasion.toFixed(2).toString(),
      alerts: losAngelesAbrasionData.results.alerts[0],
    };
  }

  if (sandEquivalentData) {
    dataSand = {
      sandEquivalent: sandEquivalentData.results.sandEquivalent.toString(),
      alerts: sandEquivalentData.results.alerts[0],
    };
  }

  if (angularityData) {
    dataAngularity.container_other_data.push({
      label: t('angularity.average_angularity'),
      value: angularityData.results.averageOfAll,
      unity: '%',
    });

    angularityData.results.angularities.map((value) => {
      const { label, angularity } = value;
      angularityRows.push({
        label,
        angularity,
      });
    });
  }

  if (viscosityRotationalData) {
    dataViscosity = {
      compressionTemperature: {
        higher: viscosityRotationalData.results.compressionTemperatureRange.higher.toFixed(2).toString(),
        lower: viscosityRotationalData.results.compressionTemperatureRange.lower.toFixed(2).toString(),
        average: viscosityRotationalData.results.compressionTemperatureRange.average.toFixed(2).toString(),
      },
      machiningTemperature: {
        higher: viscosityRotationalData.results.machiningTemperatureRange.higher.toFixed(2).toString(),
        lower: viscosityRotationalData.results.machiningTemperatureRange.lower.toFixed(2).toString(),
        average: viscosityRotationalData.results.machiningTemperatureRange.average.toFixed(2).toString(),
      },
      curvePoints: viscosityRotationalData.results.curvePoints,
    };
  }

  if (penetrationData) {
    dataPenetration = {
      penetration: penetrationData.results.penetration.toString(),
      alerts: penetrationData.results.alerts[0],
    };
  }

  if (softeningPointData) {
    dataSoftening = {
      softeningPoint: softeningPointData.results.softeningPoint.toString(),
      alerts: softeningPointData.results.alerts,
    };
  }

  if (flashPointData) {
    dataFlash.container_other_data.push({
      label: t('flashPoint.temperature'),
      value: flashPointData.results.temperature,
      unity: '°C',
    });
  }

  if (ductilityData) {
    dataDuctility.container_other_data.push({
      label: t('asphalt.essays.ductility'),
      value: ductilityData.results.ductility.toFixed(2),
      unity: 'mm',
    });
  }

  if (rtfoData) {
    dataRtfo = {
      weightLossAverage: rtfoData.results.weightLossAverage.toFixed(2).toString(),
      list: rtfoData.results.list,
      alerts: rtfoData.results.alerts[0],
    };

    rtfoRows = dataRtfo.list.map((item, index) => ({
      id: index + 1,
      weightLoss: item.weightLoss.toFixed(2),
    }));
  }

  if (elasticRecoveryData) {
    dataElastic.container_other_data.push({
      label: t('elasticRecovery.elasticRecovery'),
      value: elasticRecoveryData.results.elasticRecovery,
      unity: '%',
    });
  }

  //------------------------------------Text Format------------------------------------------------------

  const sections = [
    // Adicionando uma nova seção para informações do usuário
    {
      condition: true, // Sempre incluir esta seção
      title: 'Informações do Usuário',
      key: 'userInformation',
      content: (doc, currentY) => {
        // Função para adicionar texto à margem esquerda
        const addTextToLeftMargin = (doc, text, x, y) => {
          doc.text(text, x, y);
        };

        // Adicionando informações do usuário
        addTextToLeftMargin(doc, `Nome: ${user.name}`, 10, currentY);
        currentY += 5;
        addTextToLeftMargin(doc, `E-mail: ${user.email}`, 10, currentY);
        return currentY + 10; // Ajuste a posição Y para a próxima seção
      },
    },
    {
      condition: granulometryRows.length > 0,
      title: t('asphalt.essays.granulometry'),
      key: 'granulometry',
      content: async (doc, currentY) => {
        const image = (await addImageProcess(logo.src)) as HTMLImageElement;
        addTable(doc, granulometryRows, granulometryColumns, currentY);
        const tableHeight = (doc as any).lastAutoTable.finalY - currentY;
        currentY += tableHeight + 5;
        const chart = document.getElementById('chart-div-granulometry');
        if (chart) {
          currentY = handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));
          // Verificar se a página chegou ao final
          return addChart(chart, doc, currentY);
        }
        return currentY;
      },
    },
    {
      condition: granulometryResults.length > 0,
      title: t('asphalt.essays.granulometryResults'),
      key: 'granulometryResults',
      content: (doc, currentY) => {
        currentY += 5;
        granulometryResults.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        return currentY;
      },
    },
    {
      condition: dataSpecificMass.specificMassContainer.length > 0,
      title: t('asphalt.essays.specifyMass'),
      key: 'specificMass',
      content: (doc, currentY) => {
        currentY += 5;
        dataSpecificMass.specificMassContainer.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        return currentY;
      },
    },
    {
      condition: dataShape.shapeIndexContainer.length > 0,
      title: t('asphalt.essays.shapeIndex'),
      key: 'shapeIndex',
      content: (doc, currentY) => {
        dataShape.shapeIndexContainer.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        return currentY;
      },
    },
    {
      condition: elongatedParticlesRows,
      title: t('asphalt.essays.elongatedParticles'),
      key: 'elongatedParticles',
      content: (doc, currentY) => {
        addTable(doc, elongatedParticlesRows, elongatedParticlesColumns, currentY);
        const tableHeight = (doc as any).lastAutoTable.finalY - currentY;
        return currentY + tableHeight + 5;
      },
    },
    {
      condition: filmDisplacement,
      title: t('adhesiveness.step2'),
      key: 'filmDisplacement',
      content: (doc, currentY) => {
        addTextToLeftMargin(doc, `${t('adhesiveness.chosen-filmDisplacement')}: ${filmDisplacement}`, 10, currentY);
        return currentY + 5;
      },
    },
    {
      condition: dataLosAngeles,
      title: t('asphalt.essays.abrasion'),
      key: 'abrasion',
      content: (doc, currentY) => {
        addTextToLeftMargin(
          doc,
          `${t('asphalt.essays.abrasion')}: ${dataLosAngeles.losAngelesAbrasion}%`,
          10,
          currentY
        );
        return currentY + 5;
      },
    },
    {
      condition: dataSand,
      title: t('asphalt.essays.sandEquivalent'),
      key: 'sandEquivalent',
      content: (doc, currentY) => {
        addTextToLeftMargin(doc, `${t('sandEquivalent-sand-equivalent')}: ${dataSand.sandEquivalent}%`, 10, currentY);
        return currentY + 5;
      },
    },
    {
      condition: dataAngularity.container_other_data.length > 0,
      title: t('asphalt.essays.angularity'),
      key: 'angularity',
      content: (doc, currentY) => {
        dataAngularity.container_other_data.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        if (angularityRows.length > 0) {
          addTable(doc, angularityRows, angularityColumns, currentY);
          const tableHeight = (doc as any).lastAutoTable.finalY - currentY;
          currentY = tableHeight + 10;
        }
        return currentY + 10;
      },
    },
    {
      condition: dataViscosity,
      title: t('asphalt.essays.viscosityRotational'),
      key: 'viscosityRotational',
      content: async (doc, currentY) => {
        addTextToLeftMargin(doc, `${t('saybolt-furol.compression-temperature')}`, 10, currentY);
        currentY += 5;
        addTextToLeftMargin(
          doc,
          `${t('saybolt-furol.higher')}: ${dataViscosity.compressionTemperature.higher}°C`,
          10,
          currentY
        );
        currentY += 5;
        addTextToLeftMargin(
          doc,
          `${t('saybolt-furol.average')}: ${dataViscosity.compressionTemperature.average}°C`,
          10,
          currentY
        );
        currentY += 5;
        addTextToLeftMargin(
          doc,
          `${t('saybolt-furol.lower')}: ${dataViscosity.compressionTemperature.lower}°C`,
          10,
          currentY
        );
        currentY += 10;
        addTextToLeftMargin(doc, `${t('saybolt-furol.machining-temperature')}`, 10, currentY);
        currentY += 5;
        addTextToLeftMargin(
          doc,
          `${t('saybolt-furol.higher')}: ${dataViscosity.machiningTemperature.higher}°C`,
          10,
          currentY
        );
        currentY += 5;
        addTextToLeftMargin(
          doc,
          `${t('saybolt-furol.average')}: ${dataViscosity.machiningTemperature.average}°C`,
          10,
          currentY
        );
        currentY += 5;
        addTextToLeftMargin(
          doc,
          `${t('saybolt-furol.lower')}: ${dataViscosity.machiningTemperature.lower}°C`,
          10,
          currentY
        );
        const chart = document.getElementById('chart-div-viscosity');
        if (chart) {
          return addChart(chart, doc, currentY);
        }
        return currentY + 5;
      },
    },
    {
      condition: dataPenetration,
      title: t('asphalt.essays.penetration-asphalt'),
      key: 'penetration',
      content: (doc, currentY) => {
        addTextToLeftMargin(
          doc,
          `${t('asphalt.essays.penetration-asphalt')}: ${dataPenetration.penetration}mm`,
          10,
          currentY
        );
        return currentY + 5;
      },
    },
    {
      condition: dataSoftening,
      title: t('asphalt.essays.softeningPoint'),
      key: 'softeningPoint',
      content: (doc, currentY) => {
        addTextToLeftMargin(doc, `${t('softeningPoint-result')}: ${dataSoftening.softeningPoint}°C`, 10, currentY);
        return currentY + 5;
      },
    },
    {
      condition: dataFlash.container_other_data.length > 0,
      title: t('asphalt.essays.flashPoint'),
      key: 'flashPoint',
      content: (doc, currentY) => {
        dataFlash.container_other_data.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        return currentY + 5;
      },
    },
    {
      condition: dataDuctility.container_other_data.length > 0,
      title: t('asphalt.essays.ductility'),
      key: 'ductility',
      content: (doc, currentY) => {
        dataDuctility.container_other_data.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        return currentY + 5;
      },
    },
    {
      condition: dataRtfo,
      title: t('asphalt.essays.rtfo'),
      key: 'rtfo',
      content: (doc, currentY) => {
        addTextToLeftMargin(doc, `${t('rtfo-weight-loss-average')}: ${dataRtfo.weightLossAverage} %`, 10, currentY);
        if (rtfoRows) {
          addTable(doc, rtfoRows, rtfoColumns, currentY);
          const tableHeight = (doc as any).lastAutoTable.finalY - currentY;
          return currentY + tableHeight + 5;
        }
        return currentY + 5;
      },
    },
    {
      condition: dataElastic.container_other_data.length > 0,
      title: t('asphalt.essays.elasticRecovery'),
      key: 'elasticRecovery',
      content: (doc, currentY) => {
        dataElastic.container_other_data.forEach((item) => {
          addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
          currentY += 5;
        });
        return currentY + 5;
      },
    },
  ];

  const calculatePageNumber = (doc: any) => {
    const totalPages = doc.internal.pages.length;
    for (let pageNumber = 1; pageNumber < totalPages; pageNumber++) {
      if (pageNumber > 1) {
        doc.setPage(pageNumber);
        addPageNumber(doc, pageNumber);
      }
    }
  };

  const addPageNumber = (doc: any, pageNumber: number) => {
    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;

    doc.setLineWidth(0.5);
    doc.line(10, lineYPosition, 200, lineYPosition);
    addCenteredText(doc, `${pageNumber}`, lineYPosition + 5, 10);
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

  const addTextToLeftMargin = (doc: any, text: any, margin: any, y: any, fontSize = 12) => {
    const x = margin;
    doc.setFontSize(fontSize);
    doc.text(x, y, text);
  };
  const addImageProcess = async (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
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

  const addCapa = (doc: any, logo: any, nomeProjeto: string, nomeMaterial: string) => {
    doc.addImage(logo, 'png', 5, 5, 50, 8);
    doc.addImage(logo, 'png', 155, 5, 50, 8);

    let currentY = 55;
    addCenteredText(doc, `${t('asphalt.essays.project.title')}`, currentY, 12);
    currentY += 50;
    addCenteredText(doc, `${t('asphalt.essays.project.name')}: ${nomeProjeto}`, currentY, 12);
    currentY += 90;
    addTextToRightMargin(doc, `${t('asphalt.essays.project.description.text')} ${nomeMaterial}`, 100, currentY);

    const pageHeight = doc.internal.pageSize.height;
    const lineYPosition = pageHeight - 10;
    const dateYPosition = lineYPosition - 5;

    const formattedDate = getCurrentDateFormatted();

    addCenteredText(doc, formattedDate, dateYPosition, 12);
  };

  const generate = async () => {
    const doc = new jsPDF();
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    addCapa(doc, image, name, type);
    doc.addPage();

    doc.addPage();

    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);

    addCenteredText(doc, `${t('general data of essay')}`, 30, 12);
    addTextToLeftMargin(doc, `${t('asphalt.materials.name')}: ${name}`, 10, 40);
    addTextToLeftMargin(doc, `${t('asphalt.materials.type')}: ${type}`, 10, 45);

    let currentY = 55;
    const summaryItems: SummaryItem[] = [];

    for (const section of sections) {
      if (section.condition) {
        currentY += 5;
        doc.setFont('Helvetica', 'bold');
        addTextToLeftMargin(doc, section.title, 10, currentY, 12);
        currentY += 5;
        doc.setFont('Helvetica', 'normal');

        // Verificar se a página chegou ao final
        const pageHeight = doc.internal.pageSize.getHeight();
        if (currentY > pageHeight - 10) {
          // Usar o handleAddPage para adicionar uma nova página
          currentY = handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));
        }

        currentY = await section.content(doc, currentY);
        const pageIndex = doc.internal.pages.length - 1;
        summaryItems.push({ title: section.title, page: pageIndex, key: section.key });
      }
    }

    calculatePageNumber(doc);

    doc.setPage(2);
    addSummary(doc, image, summaryItems);

    doc.save('material.pdf');
  };

  return (
    <Box>
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
    </Box>
  );
};

export default GeneratePDF;
