import jsPDF from 'jspdf';
import React from 'react';
import logo from '../../../assets/fasteng/LogoBlack.png';
import autoTable from 'jspdf-autotable';
import { EssaysData } from '@/pages/asphalt/materials/material/[id]';
import { t } from 'i18next';

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
  let rtfoColumns = [t('rtfo.weight-loss')];

  let granulometryRows = [];
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
  const addCenteredText = (doc: any, text: any, y: any, fontSize: number = 12) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.setFontSize(fontSize);
    doc.text(x, y, text);
  };

  // const addTextToRightMargin = (doc: any, text: any, margin: any, y: any) => {
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const textWidth = (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
  //   const x = pageWidth - margin - textWidth;
  //   doc.text(x, y, text);
  // };

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

  const generate = async () => {
    const doc = new jsPDF();

    const image = (await addImageProcess(logo.src)) as HTMLImageElement;

    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);

    addCenteredText(doc, `${t('general data of essay')}`, 30);
    addTextToLeftMargin(doc, `${t('asphalt.materials.name')}: ${name}`, 10, 40);
    addTextToLeftMargin(doc, `${t('asphalt.materials.type')}: ${type}`, 10, 45);

    let currentY = 55;
    if (granulometryRows.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.granulometry')}`, 10, currentY, 14);
      currentY += 5;
      addTable(doc, granulometryRows, granulometryColumns, currentY);
      currentY += (doc as any).lastAutoTable.finalY - 50;
      //chart
    }
    if (dataSpecificMass.specificMassContainer.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.specifyMass')}`, 10, currentY, 14);
      currentY += 5;
      dataSpecificMass.specificMassContainer.forEach((item, index) => {
        addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
        currentY += 5;
      });
      currentY += 10;
    }

    if (dataShape.shapeIndexContainer.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.shapeIndex')}`, 10, currentY, 14);
      currentY += 5;
      dataShape.shapeIndexContainer.forEach((item, index) => {
        addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
        currentY += 5;
      });
      currentY += 10;
    }

    if (elongatedParticlesRows) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.elongatedParticles')}`, 10, currentY, 14);
      currentY += 5;
      addTable(doc, elongatedParticlesRows, elongatedParticlesColumns, currentY);
      currentY += (doc as any).lastAutoTable.finalY - 50;
    }

    if (filmDisplacement) {
      addTextToLeftMargin(doc, `${t('asphalt.essay.adhesiveness')}`, 10, currentY, 14);
      currentY += 5;
      addTextToLeftMargin(doc, `${t('adhesiveness.chosen-filmDisplacement')}: ${filmDisplacement}`, 10, currentY);
      currentY += 10;
    }

    if (dataLosAngeles) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.abrasion')}`, 10, currentY, 14);
      currentY += 5;
      addTextToLeftMargin(doc, `${t('asphalt.essays.abrasion')}: ${dataLosAngeles.losAngelesAbrasion}%`, 10, currentY);
      currentY += 10;
    }

    if (dataSand) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.sandEquivalent')}`, 10, currentY, 14);
      currentY += 5;
      addTextToLeftMargin(doc, `${t('sandEquivalent-sand-equivalent')}: ${dataSand.sandEquivalent}%`, 10, currentY);
      currentY += 10;
    }

    if (dataAngularity.container_other_data.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.angularity')}`, 10, currentY, 14);
      currentY += 5;
      dataAngularity.container_other_data.forEach((item, index) => {
        addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
        currentY += 5;
      });
      currentY += 5;
      if (angularityRows.length > 0) {
        addTable(doc, angularityRows, angularityColumns, currentY);
        currentY += (doc as any).lastAutoTable.finalY - 50;
      }
      currentY += 10;
    }

    if (dataViscosity) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.viscosityRotational')}`, 10, currentY, 14);
      currentY += 5;
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
        `${t('aybolt-furol.average')}: ${dataViscosity.compressionTemperature.average}°C`,
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
      currentY += 5;
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
        `${t('aybolt-furol.average')}: ${dataViscosity.machiningTemperature.average}°C`,
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
      currentY += 10;
      //chart
    }

    if (dataPenetration) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.penetration-asphaltl')}`, 10, currentY, 14);
      currentY += 5;
      addTextToLeftMargin(
        doc,
        `${t('asphalt.essays.penetration-asphalt')}: ${dataPenetration.penetration}mm`,
        10,
        currentY
      );
      currentY += 10;
    }

    if (dataSoftening) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.softeningPoint')}`, 10, currentY, 14);
      currentY += 5;
      addTextToLeftMargin(doc, `${t('softeningPoint-result')}: ${dataSoftening.softeningPoint}°C`, 10, currentY);
      currentY += 10;
    }

    if (dataFlash.container_other_data.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.flashPoint')}`, 10, currentY, 14);
      currentY += 5;
      dataFlash.container_other_data.forEach((item, index) => {
        addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
        currentY += 5;
      });
      currentY += 10;
    }

    if (dataDuctility.container_other_data.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.ductility')}`, 10, currentY, 14);
      currentY += 5;
      dataDuctility.container_other_data.forEach((item, index) => {
        addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
        currentY += 10;
      });
      currentY += 10;
    }

    if (dataRtfo) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.rtfo')}`, 10, currentY, 14);
      currentY += 5;
      addTextToLeftMargin(doc, `${t('rtfo-weight-loss-average')}: ${dataRtfo.weightLossAverage} %`, 10, currentY);
      currentY += 5;
      if (rtfoRows) {
        addTable(doc, rtfoRows, rtfoColumns, currentY);
        currentY = (doc as any).lastAutoTable.finalY - 50;
      }
      currentY += 10;
    }

    if (dataElastic.container_other_data.length > 0) {
      addTextToLeftMargin(doc, `${t('asphalt.essays.elasticRecovery')}`, 10, currentY, 14);
      dataElastic.container_other_data.forEach((item, index) => {
        addTextToLeftMargin(doc, `${item.label}: ${item.value} ${item.unity}`, 10, currentY);
        currentY += 10;
      });
      currentY += 10;
    }
    doc.save('material.pdf');
  };

  return (
    <div>
      <button onClick={generate}>Download PDF</button>
    </div>
  );
};

export default GeneratePDF;
