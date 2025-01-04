import {
  addCenteredText,
  addImageProcess,
  addCapa,
  SummaryItem,
  addSummary,
  handleAddPage,
  formatDate,
  getCurrentDateFormatted,
  addChart,
} from '@/components/generatePDF/common';
import useAuth from '@/contexts/auth';
import { ABCPData } from '@/stores/concrete/abcp/abcp.store';
import { Box, Button, Tooltip } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import { ConcreteMaterial } from '@/interfaces/concrete';
import { useState, useEffect } from 'react';
import abcpDosageService from '@/services/concrete/dosages/abcp/abcp-consult.service';

interface IGeneratedPDF {
  dosage: ABCPData;
}

const GenerateAbcpDosagePDF = ({ dosage }: IGeneratedPDF) => {
  console.log('🚀 ~ GenerateAbcpDosagePDF ~ dosage:', dosage);
  const { user } = useAuth();
  const [materialsData, setMaterialsData] = useState<ConcreteMaterial[]>([]);
  console.log('🚀 ~ GenerateAbcpDosagePDF ~ materialsData:', materialsData);
  const [materialsEssays, setMaterialsEssays] = useState<any[]>([]);
  console.log('🚀 ~ GenerateAbcpDosagePDF ~ materialsEssays:', materialsEssays);

  useEffect(() => {
    const handleGetMaterialsData = async () => {
      try {
        const materialsIds = Object.entries(dosage.materialSelectionData).map(([key, value]) => value.id);
        const response = await abcpDosageService.getConcreteMaterials(materialsIds);
        setMaterialsData(response.data.materials);
        setMaterialsEssays(response.data.essays);
      } catch (error) {
        console.error('Failed to get materials data:', error);
      }
    };
    handleGetMaterialsData();
  }, [dosage]);

  const addHeader = (doc: jsPDF, image: HTMLImageElement) => {
    doc.addImage(image, 'png', 5, 5, 50, 8);
    doc.addImage(image, 'png', 155, 5, 50, 8);
  };

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;
    let currentY = 30;

    const { cc, ca, careia, cb } = dosage.results;
    const coefficients = `${cc / cc} : ${(careia / cc).toFixed(3)} : ${(cb / cc).toFixed(3)} : ${(ca / cc).toFixed(3)}`;

    addCapa(
      doc,
      image,
      'abcp',
      dosage.createdAt.toString(),
      dosage.generalData.name,
      dosage.generalData.operator,
      dosage.generalData.laboratory
    );

    handleAddPage(doc, image, 30, t('abcp.dosage-pdf-title'));

    const summaryItems: SummaryItem[] = [
      {
        title: t('dosages.report.general-data'),
        page: 3,
      },
      {
        title: t('dosages.report.materials-caracterization'),
        page: 4,
      },
      {
        title: t('dosages.report.results'),
        page: 3,
      },
      {
        title: t('abcp.results.coefficients'),
        page: 3,
      },
      {
        title: t('abcp.result.graph'),
        page: 3,
      },
    ];

    const materialNames = materialsData.map((material) => ({
      name: material.name,
      type: material.type,
    }));

    const userData = [
      {
        key: 'name',
        label: t('asphalt.dosages.marshall.generated-by'),
        value: user.name,
      },
      {
        key: 'email',
        label: t('asphalt.dosages.marshall.email'),
        value: user.email,
      },
    ];

    const generalDataArray = [
      {
        key: 'projectName',
        label: t('asphalt.project_name'),
        value: dosage.generalData.name,
      },
      {
        key: 'usedMaterials',
        label: t('asphalt.used-materials'),
        value: materialNames,
      },
      {
        key: 'initialDate',
        label: t('asphalt.project-initial-date'),
        value: formatDate(dosage.createdAt.toString()),
      },
      {
        key: 'pdfGenerationDate',
        label: t('asphalt.pdf-generation-date'),
        value: getCurrentDateFormatted(),
      },
      {
        key: 'operator',
        label: t('asphalt.dosages.project-author'),
        value: dosage.generalData.operator,
      },
      {
        key: 'laboratory',
        label: t('asphalt.dosages.project-laboratory'),
        value: dosage.generalData.laboratory,
      },
    ];

    const materialsArray = materialsData.map((material, idx) => ({
      name: material.name,
      type: material.type,
      creationDate: formatDate(material.createdAt.toString()),
      source: material.description.source ? material.description.source : '---',
      receivedDate: material.description.recieveDate
        ? formatDate(material.description.recieveDate?.toString())
        : '--/--/----',
      classification: '?',
    }));

    const essaysResults = [];

    materialsEssays.forEach((material) => {
      material.forEach((essay) => {
        console.log("🚀 ~ material.forEach ~ essay:", essay)
        const essayData = {
          essayType: essay.essayName,
          materialName: essay.data.generalData.material.name,
          experimentName: essay.data.generalData.experimentName,
          unitMass: essay.data.result.result,
        }

        essaysResults.push(essayData);
      });
    });

    console.log("🚀 ~ generatePDF ~ essaysResults:", essaysResults)

    // const essaysResults = materialsEssays.flatMap((essay) => ({
    //   granulometry: {
    //     results: {
    //       essayName: essay[granulometryIndex].data.generalData.name,
    //       nominalSize: essay[granulometryIndex].data?.results.nominal_size,
    //       nominalDiammeter: essay[granulometryIndex].data?.results.nominal_diameter,
    //       finenessModule: essay[granulometryIndex].data?.results.fineness_module,
    //     },
    //   },
    // }))

    addSummary(doc, image, summaryItems, '---', materialNames, t('abcp.dosage-pdf-title'));

    handleAddPage(doc, image, 30, t('abcp.dosage-pdf-title'));

    for (let i = 0; i < userData.length; i++) {
      doc.setFontSize(10);
      const value = userData[i].value ? userData[i].value.toString() : '---';
      doc.text(`${userData[i].label}: ${value}`, 10, currentY);
      currentY += 5;
    }

    currentY += 10;

    doc.setFontSize(12);
    doc.text(`1. ${t('dosages.report.general-data').toUpperCase()}`, 10, currentY);
    currentY += 15;

    // Adicionar informações do usuário

    for (let i = 0; i < generalDataArray.length; i++) {
      doc.setFontSize(12);
      doc.text(`${generalDataArray[i].label}:`, 10, currentY);
      currentY += 5;
      doc.setFontSize(10);
      const value = generalDataArray[i].value ? generalDataArray[i].value.toString().split(',').join('\n') : '---';
      doc.text(`${value}`, 10, currentY);
      if (generalDataArray[i].key === 'usedMaterials') {
        currentY += 25;
      } else {
        currentY += 10;
      }
    }

    handleAddPage(doc, image, 30, t('abcp.dosage-pdf-title'));

    // Cria uma página para cada material

    materialsArray.forEach((material, idx) => {
      currentY = 30;
      doc.setFontSize(12);
      doc.text(`2. ${t('dosages.report.materials-caracterization').toUpperCase()}`, 10, currentY);
      currentY += 10;
      doc.text(`2.${idx + 1}. ${material.name.toUpperCase()}`, 10, currentY);
      currentY += 15;

      // Material general data

      Object.entries(material).forEach(([key, value]) => {
        doc.setFontSize(12);
        doc.text(t(`dosages.report.material-${key}`), 10, currentY);
        currentY += 5;
        doc.setFontSize(10);
        doc.text(value, 10, currentY);
        currentY += 10;
      });

      currentY += 10;

      // Material relevant essays

      doc.setFontSize(12);
      doc.text(`Propriedades`.toUpperCase(), 10, currentY);
      currentY += 10;

      Object.entries(essaysResults[idx]).forEach(([key, value]) => {
        doc.setFontSize(12);
        doc.text(`${t(`asphalt.essays.${key}`)}:`, 10, currentY);

        Object.entries(value).forEach(([subKey, subValue]) => {
          doc.text(`${t(`asphalt.essays.${key}.${subKey}`)}:`, 20, (currentY += 5));

          Object.entries(subValue).forEach(([subSubKey, subSubValue]) => {
            doc.setFontSize(10);
            doc.text(
              `${t(`asphalt.essays.${key}.${subKey}.${subSubKey}`)}: ${
                !isNaN(Number(subSubValue)) ? Number(subSubValue).toFixed(2) : subSubValue
              }`,
              30,
              (currentY += 5)
            );
          });
        });
      });

      handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));
    });

    currentY = 30;

    // Resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:'.toUpperCase(), 10, currentY);
    currentY += 10;

    const materials = materialsData.map((material) => material.name);

    let index = 0;

    doc.setFontSize(12);
    doc.text(
      t('asphalt.dosages.marshall.materials-final-proportions').toUpperCase(),
      doc.internal.pageSize.getWidth() / 2,
      currentY,
      {
        align: 'center',
      }
    );
    currentY += 10;

    const conditionValue = dosage.insertParamsData.condition;
    const tolerance = 0.0001;

    const conditionLabel =
      Math.abs(conditionValue - 4) < tolerance
        ? 'Condição A - Sd = 4,0'
        : Math.abs(conditionValue - 5.5) < tolerance
        ? 'Condição B - Sd = 5,5'
        : 'Condição C - Sd = 7,0';

    const generalResultsValues = [
      { label: t('abcp.results.resistance-curve'), value: dosage.results?.resistanceCurve, measureUnity: 'MPa' },
      { label: conditionLabel, value: '', measureUnity: 'MPa' },
      { label: t('abcp.results.fck'), value: dosage.insertParamsData.fck, measureUnity: 'MPa' },
      { label: t('abcp.results.reduction'), value: dosage.insertParamsData.reduction, measureUnity: '%' },
    ];

    const resultsValues = [
      { label: t('abcp.results.fcj'), value: dosage.results?.fcj, measureUnity: 'MPa' },
      { label: t('abcp.results.water-cement'), value: dosage.results?.ac, measureUnity: 'MPa' },
      { label: t('abcp.results.water-consume'), value: dosage.results?.cb, measureUnity: 'Lm³' },
      { label: t('abcp.results.cement-consume'), value: dosage.results?.cc, measureUnity: 'kg/m³' },
      { label: t('abcp.results.coarse-aggregate-consume'), value: dosage.results?.cc, measureUnity: 'kg/m³' },
      { label: t('abcp.results.fine-aggregate-consume'), value: dosage.results?.cc, measureUnity: 'kg/m³' },
    ];

    generalResultsValues.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.measureUnity}`, 10, currentY);
      currentY += index + 1 === generalResultsValues.length ? 10 : 5;
    });

    doc.setFontSize(12);
    doc.text(t('Resultados').toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY + 5, {
      align: 'center',
    });

    currentY += 15;

    resultsValues.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.measureUnity}`, 10, currentY);
      currentY += index + 1 === resultsValues.length ? 10 : 5;
    });

    doc.setFontSize(12);
    doc.text(t('abcp.result.coefficients').toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY + 5, {
      align: 'center',
    });

    currentY += 15;

    doc.setFontSize(12);
    doc.text(t('abcp.result.coefficients').toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY + 5, {
      align: 'center',
    });

    currentY += 15;

    doc.setPage(3);

    doc.setFontSize(12);
    doc.text(t('abcp.result.graph').toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY + 5, {
      align: 'center',
    });

    currentY += 15;

    await addChart(document.getElementById('chart-div-abramsCurveGraph') as HTMLDivElement, doc, currentY);

    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
        <Box onClick={dosage?.results && generatePDF} sx={{ width: 'fit-content' }}>
          <Button variant="contained" color="primary" disabled={!dosage?.results}>
            Gerar PDF
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GenerateAbcpDosagePDF;
