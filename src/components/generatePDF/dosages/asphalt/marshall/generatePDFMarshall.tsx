import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import autoTable, { Color } from 'jspdf-autotable';
import { Box, Button, Tooltip } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import logo from '@/assets/fasteng/LogoBlack.png';
import {
  addCapa,
  addCenteredText,
  addImageProcess,
  addSummary,
  calculatePageNumber,
  formatDate,
  getCurrentDateFormatted,
  handleAddPage,
  SummaryItem,
} from '../../../common';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import marshallDosageService from '@/services/asphalt/dosages/marshall/marshall.consult.service';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import { isTemplateExpression } from 'typescript';

interface IGeneratedPDF {
  dosage: MarshallData;
}

const GenerateMarshallDosagePDF = ({ dosage }: IGeneratedPDF) => {
  console.log('🚀 ~ GenerateMarshallDosagePDF ~ dosage:', dosage);
  const { user } = useAuth();
  const [materialsData, setMaterialsData] = useState<AsphaltMaterial[]>([]);
  console.log("🚀 ~ GenerateMarshallDosagePDF ~ materialsData:", materialsData)
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
      'marshall',
      dosage.createdAt.toString(),
      dosage.generalData.name,
      dosage.generalData.operator,
      dosage.generalData.laboratory
    );
    handleAddPage(doc, image, currentY);

    const summaryItems: SummaryItem[] = [
      {
        title: t('asphalt.dosages.marshall.general-data'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.marshall.materials-caracterization'),
        page: 4,
      },
      {
        title: t('asphalt.dosages.marshall.materials-final-proportions'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.marshall.asphalt-mass-quantitative'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.binder-volumetric-mechanic-params'),
        page: 3,
      },
      {
        title: t('asphalt.dosages.mineral-aggregate-voids'),
        page: 4,
      },
    ];

    const materialNames = dosage.materialSelectionData.aggregates.map((material) => material.name);
    const materialNamesWithBinder = [...materialNames, dosage.materialSelectionData.binder].join(', ');

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
        value: dosage.binderTrialData.trial,
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

    // Inserir o binder no array de materiais

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

    console.log('🚀 ~ generatePDF ~ essaysResults:', essaysResults);

    const volumetricMechanicParams = [
      {
        label: t('asphalt.dosages.optimum-binder'),
        value: dosage.optimumBinderContentData.optimumBinder.optimumContent.toFixed(2).toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.dmt'),
        value: dosage?.confirmationCompressionData.confirmedSpecificGravity?.result.toFixed(2).toString(),
        unity: 'g/cm³',
      },
      {
        label: t('asphalt.dosages.gmb'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.apparentBulkSpecificGravity
          .toFixed(2)
          .toString(),
        unity: 'g/cm³',
      },
      {
        label: t('asphalt.dosages.vv'),
        value: (
          dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.aggregateVolumeVoids * 100
        ).toFixed(2),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.vam'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.voidsFilledAsphalt
          .toFixed(2)
          .toString(),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.rbv') + ' (RBV)',
        value: (
          dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.ratioBitumenVoid * 100
        ).toFixed(2),
        unity: '%',
      },
      {
        label: t('asphalt.dosages.marshall-stability'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.stability
          .toFixed(2)
          .toString(),
        unity: 'N',
      },
      {
        label: t('asphalt.dosages.fluency'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.fluency.toFixed(2).toString(),
        unity: 'mm',
      },
      {
        label: t('asphalt.dosages.indirect-tensile-strength'),
        value: dosage?.confirmationCompressionData.confirmedVolumetricParameters?.values?.indirectTensileStrength
          .toFixed(2)
          .toString(),
        unity: 'MPa',
      },
    ];

    addSummary(
      doc,
      image,
      summaryItems,
      materialsEssays[0][0].data.generalData.material.name,
      dosage.materialSelectionData.aggregates
    );

    handleAddPage(doc, image, currentY);

    for (let i = 0; i < userData.length; i++) {
      doc.setFontSize(10);
      const value = userData[i].value ? userData[i].value.toString() : '---';
      doc.text(`${userData[i].label}: ${value}`, 10, currentY);
      currentY += 5;
    }

    currentY += 10;

    doc.setFontSize(12);
    doc.text(`1. ${t('asphalt.dosages.marshall.general-data').toUpperCase()}`, 10, currentY);
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

    handleAddPage(doc, image, currentY);

    // Cria uma página para cada material

    materialsArray.forEach((material, idx) => {
      currentY = 30;
      doc.setFontSize(12);
      doc.text(`2. ${t('asphalt.dosages.marshall.materials-caracterization').toUpperCase()}`, 10, currentY);
      currentY += 10;
      doc.text(`2.${idx + 1}. ${material.name.toUpperCase()}`, 10, currentY);
      currentY += 15;

      // Material general data

      Object.entries(material).forEach(([key, value]) => {
        doc.setFontSize(12);
        doc.text(t(`asphalt.dosages.marshall.${key}`), 10, currentY);
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

      handleAddPage(doc, image, 30);
    });

    currentY = 30;

    // Adicionar resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:'.toUpperCase(), 10, currentY);
    currentY += 10; // 70

    const materials = materialsData.map((material) => material.name);
    console.log('🚀 ~ generatePDF ~ materials:', materials);

    // const optimumBinder =
    //   dosage?.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.map((confirmedPercentsOfDosage) =>
    //     confirmedPercentsOfDosage.toFixed(2)
    //   ) || [];

    // const optimumBinder = dosage?.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage.map(
    //   (percent, idx) => {
    //     if (materialsData[idx].type !== 'asphaltBinder') {
    //       console.log("Agregado")
    //       return percent.toFixed(2);
    //     } else {
    //       console.log("ligante")
    //       return dosage.optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2);
    //     }
    //   }
    // );
    

    const optimumBinder = []; 
    let index = 0;
    
    materialsData.forEach((material, idx) => {
      if (material.type !== 'asphaltBinder') {
        optimumBinder.push(Number(dosage.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[index]).toFixed(2));
        index++;
      } else {
        optimumBinder.push(Number(dosage.optimumBinderContentData?.optimumBinder?.optimumContent).toFixed(2));
      }
    })

    console.log("🚀 ~ optimumBinder ~ optimumBinder:", optimumBinder)

    // optimumBinder.push(dosage.optimumBinderContentData?.optimumBinder?.optimumContent.toFixed(2));

    doc.setFontSize(12);
    doc.text(
      t('asphalt.dosages.marshall.materials-final-proportions').toUpperCase(),
      doc.internal.pageSize.getWidth() / 2,
      currentY,
      {
        align: 'center',
      }
    );
    currentY += 10; // 80

    autoTable(doc, {
      head: [materials],
      body: [optimumBinder],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: [255, 165, 0], // cor laranja
        textColor: [0, 0, 0], // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY,
    });

    currentY += 30; // 110

    //Quantitativos

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.marshall.asphalt-mass-quantitative'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });
    currentY += 10; // 120

    const quantitative =
      dosage?.confirmationCompressionData?.confirmedVolumetricParameters?.quantitative.map(
        (confirmedPercentsOfDosage) => confirmedPercentsOfDosage.toFixed(2)
      ) || [];

    const segundaTabelaConfig = {
      head: [materials],
      body: [quantitative],
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: '#FFA500', // cor laranja
        textColor: [0, 0, 0] as Color, // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, segundaTabelaConfig);

    currentY += 30; // 150

    // Parametros volumétricos
    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.binder-volumetric-mechanic-params'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 10; // 160

    for (let i = 0; i < volumetricMechanicParams.length; i++) {
      doc.text(`${volumetricMechanicParams[i].label}: ${volumetricMechanicParams[i].value} %`, 10, currentY);
      currentY += 5;
    }

    const headers = [
      t('asphalt.dosages.marshall.parameter'),
      t('asphalt.dosages.marshall.unity'),
      t('asphalt.dosages.marshall.bearing-layer'),
      t('asphalt.dosages.marshall.bonding-layer'),
    ];

    const volumetricParamsRows = [
      [t('asphalt.dosages.stability'), 'Kgf', '>=500', '>=500'],
      [t('asphalt.dosages.rbv'), '%', '75 - 82', '65 - 72'],
      [t('asphalt.dosages.mixture-voids'), '%', '3 - 5', '4 - 6'],
      [`${t('asphalt.dosages.indirect-tensile-strength')}` + ` (25 °C)`, 'MPa', '>= 0,65', '>= 0,65'],
    ];

    currentY += 10;

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.marshall.asphalt-mass-quantitative'), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

    currentY += 10;

    const volumetricParamsTable = {
      head: [headers],
      body: volumetricParamsRows,
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: [255, 165, 0] as Color, // cor laranja
        textColor: [0, 0, 0] as Color, // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, volumetricParamsTable);

    currentY = handleAddPage(doc, image, currentY);

    // calculatePageNumber(doc, t('marshall.dosage-pdf-title'));

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.vam'), doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    currentY += 10;

    const mineralAggregateVoidsHeaders = ['TMN', 'Vam (%'];

    const mineralAggregateVoidsbody = [
      ['9,5mm', '>= 18'],
      ['12,5mm', '>= 16'],
      ['19,1mm', '>= 15'],
    ];

    const mineralAgregateVoidsTable = {
      head: [mineralAggregateVoidsHeaders],
      body: mineralAggregateVoidsbody,
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: [255, 165, 0] as Color,
        textColor: [0, 0, 0] as Color,
        fontSize: 12,
      },
      startY: currentY,
    };

    autoTable(doc, mineralAgregateVoidsTable);

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
  };

  return (
    <>
      <Tooltip title={t('asphalt.dosages.superpave.tooltips.disabled-pdf-generator')} placement="top">
        <Box onClick={dosage?.confirmationCompressionData && generatePDF} sx={{ width: 'fit-content' }}>
          <Button variant="contained" color="primary" disabled={!dosage?.confirmationCompressionData}>
            Gerar PDF
          </Button>
        </Box>
      </Tooltip>
    </>
  );
};

export default GenerateMarshallDosagePDF;
