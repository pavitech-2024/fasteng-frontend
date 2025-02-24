import {
  addCenteredText,
  addImageProcess,
  addCapa,
  SummaryItem,
  addSummary,
  addHeader,
  handleAddPage,
  formatDate,
  getCurrentDateFormatted,
} from '@/components/generatePDF/common';
import useAuth from '@/contexts/auth';
import { Box, Button, Tooltip } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import autoTable, { Color } from 'jspdf-autotable';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import { useState, useEffect } from 'react';

interface IGeneratedPDF {
  dosage: SuperpaveData;
}

const GenerateSuperpaveDosagePDF = ({ dosage }: IGeneratedPDF) => {
  const { user } = useAuth();
  const [materialsData, setMaterialsData] = useState<AsphaltMaterial[]>([]);
  const [materialsEssays, setMaterialsEssays] = useState<any[]>([]);

  useEffect(() => {
    const handleGetMaterialsData = async () => {
      try {
        const materialsIds = dosage.materialSelectionData.aggregates.map((material) => material._id);
        materialsIds.unshift(dosage.materialSelectionData.binder);
        const response = await materialsService.getMaterials(materialsIds);
        setMaterialsData(response.data.materials);
        setMaterialsEssays(response.data.essays);
      } catch (error) {
        console.error('Failed to get materials data:', error);
      }
    };
    handleGetMaterialsData();
  }, [dosage]);

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;
    let currentY = 30;

    addCapa(
      doc,
      image,
      'superpave',
      dosage.createdAt.toString(),
      dosage.generalData.name,
      dosage.generalData.operator,
      dosage.generalData.laboratory
    );

    handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));

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
        title: t('asphalt.dosages.superpave.asphalt-mass-quantitative'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.binder-volumetric-mechanic-params'),
        page: 3,
      },
    ];

    const materialNames = dosage.materialSelectionData.aggregates.map((material) => material.name);
    const materialNamesWithBinder = [...materialNames, materialsEssays[0][0].data.generalData.material.name].join(', ');

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
        value: materialNamesWithBinder,
      },
      {
        key: 'dnitBand',
        label: t('asphalt.dosages.marshall.dnit-track'),
        value: dosage.generalData.dnitBand,
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
        key: 'objective',
        label: t('asphalt.objective'),
        value:
          dosage.generalData.objective === 'bearing'
            ? t('asphalt.dosages.marshall.bearing-layer')
            : dosage.generalData.objective === 'bonding'
            ? t('asphalt.dosages.marshall.bonding-layer')
            : '',
      },
      {
        key: 'initialBinder',
        label: t('asphalt.dosages.marshall.initial_binder'),
        // value: dosage.binderTrialData.trial,
        value: '---',
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

    const volumetricsBody = [
      {
        label: t('asphalt.dosages.superpave.apparent-specific-mass') + ' (Gmb)',
        value: dosage.dosageResume.Gmb.toFixed(2).toString(),
        unity: 'g/cm3',
      },
      {
        label: t('asphalt.dosages.superpave.void-volume') + ' (Vv)',
        value: (dosage.dosageResume.Vv * 100).toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('Vazios do agregado mineral (VAM)'),
        value: dosage.dosageResume.Vam?.toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.rbv') + ' (RBV)',
        value: (dosage.dosageResume.RBV * 100).toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.absorbed-water'),
        value: dosage.dosageResume.percentWaterAbs.toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.superpave.specific-mass'),
        value: dosage.dosageResume.specifiesMass.toFixed(2).toString(),
        unity: 'g/cm',
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

    const essaysResults = materialsEssays
      .flatMap((essay) => {
        if (essay[0].data?.generalData.material.type !== 'asphaltBinder') {
          const granulometryIndex = essay.findIndex((item) => item.essayName === 'granulometry');
          if (granulometryIndex !== -1) {
            return {
              granulometry: {
                results: {
                  essayName: essay[granulometryIndex].data.generalData.name,
                  nominalSize: essay[granulometryIndex].data?.results.nominal_size,
                  nominalDiammeter: essay[granulometryIndex].data?.results.nominal_diameter,
                  finenessModule: essay[granulometryIndex].data?.results.fineness_module,
                },
              },
            };
          }
        } else {
          return {
            viscosityRotational: {
              machiningTemperatureRange: {
                higher: essay.find((item) => item.essayName === 'viscosityRotational').data.results
                  .machiningTemperatureRange.higher,
                lower: essay.find((item) => item.essayName === 'viscosityRotational').data.results
                  .machiningTemperatureRange.lower,
                average: essay.find((item) => item.essayName === 'viscosityRotational').data.results
                  .machiningTemperatureRange.average,
              },
            },
          };
        }
      })
      .filter((item) => item);

    addSummary(
      doc,
      summaryItems,
      materialsEssays[0][0].data.generalData.material.name,
      dosage.materialSelectionData.aggregates,
      t('superpave.dosage-pdf-title')
    );

    handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));

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

    handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));

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
    const optimumBinder = [];
    let index = 0;

    materialsData.forEach((material) => {
      if (material.type !== 'asphaltBinder') {
        optimumBinder.push(Number(dosage.secondCompressionPercentagesData?.optimumContent?.toFixed(2)));
        index++;
      }
    });

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

    const finalProportionsBody =
      dosage?.dosageResume?.ponderatedPercentsOfDosage?.map((percent) => percent.toFixed(2)) || [];

    autoTable(doc, {
      head: [materials],
      body: [finalProportionsBody],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: '#F29134', // cor laranja
        textColor: [0, 0, 0], // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY,
    });

    currentY = currentY + 30;

    doc.setFontSize(12);
    doc.text(
      t('asphalt.dosages.superpave.asphalt-mass-quantitative').toUpperCase(),
      doc.internal.pageSize.getWidth() / 2,
      currentY + 5,
      {
        align: 'center',
      }
    );

    currentY += 15;

    const quantitativesBody = dosage.dosageResume.quantitative.map((item) => item.toFixed(2));

    autoTable(doc, {
      head: [materials],
      body: [quantitativesBody],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: '#F29134', // cor laranja
        textColor: [0, 0, 0] as Color, // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY,
    });

    currentY += 30;

    // Parametros volumétricos
    doc.setFontSize(12);
    const title = t('asphalt.dosages.binder-volumetric-mechanic-params');
    const titleArray = title.split(' ');
    const wrapIndex = titleArray.findIndex((word) => word === 'mistura');
    const titleFirstLine = title.split(' ').splice(0, wrapIndex).join(' ');
    const titleSecondLine = title.split(' ').splice(wrapIndex).join(' ');
    doc.text(titleFirstLine.toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY + 5, { align: 'center' });
    currentY += 5;
    doc.text(titleSecondLine.toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY + 5, { align: 'center' });

    currentY += 15;

    volumetricsBody.forEach((resultValue, index) => {
      doc.text(`${resultValue.label}: ${resultValue.value} ${resultValue.unity}`, 10, currentY);
      currentY += index + 1 === volumetricsBody.length ? 20 : 5;
    });

    doc.setPage(3);

    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
        <Box onClick={dosage?.dosageResume && generatePDF} sx={{ width: 'fit-content' }}>
          <Button variant="contained" color="primary" disabled={!dosage?.dosageResume}>
            Gerar PDF
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GenerateSuperpaveDosagePDF;
