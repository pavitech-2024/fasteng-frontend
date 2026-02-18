import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import autoTable, { Color } from 'jspdf-autotable';
import { Box, Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import logo from '@/assets/fasteng/LogoBlack.png';
import {
  addCapa,
  addImageProcess,
  addSection,
  addSummary,
  formatDate,
  getCurrentDateFormatted,
  handleAddPage,
  SummaryItem,
} from '../../../common';
import { AsphaltMaterial } from '@/interfaces/asphalt';
import materialsService from '@/services/asphalt/asphalt-materials.service';
import Loading from '@/components/molecules/loading';

interface IGeneratedPDF {
  dosage: MarshallData;
}

const GenerateMarshallDosagePDF = ({ dosage }: IGeneratedPDF) => {
  const { user } = useAuth();
  const [materialsData, setMaterialsData] = useState<AsphaltMaterial[]>([]);
  const [materialsEssays, setMaterialsEssays] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.notebook));

  useEffect(() => {
    const handleGetMaterialsData = async () => {
      try {
        const materialsIds = dosage.materialSelectionData.aggregates.map((material) => material._id);

        materialsIds.unshift(dosage.materialSelectionData.binder);
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
    setLoading(true);
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

    handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));

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
        title: t('asphalt.dosages.marshall.granulometry_composition'),
        page: 5,
      },
      {
        title: t('asphalt.dosages.marshall.dosage_resume'),
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
      summaryItems,
      materialsEssays[0][0].data.generalData.material.name,
      dosage.materialSelectionData.aggregates,
      t('marshall.dosage-pdf-title')
    );

    handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));

    currentY += 10;

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

    handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));

    // Cria uma página para cada material

    materialsArray.forEach(async (material, idx) => {
      currentY = 40;
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

      handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));
    });

    currentY = 40;

    doc.setFontSize(12);
    doc.text(`3. ${t('asphalt.dosages.marshall.granulometric-curve').toUpperCase()}`, 10, currentY);
    currentY += 10;

    await addSection(document.getElementById('granulometric-composition-table') as HTMLDivElement, doc, currentY);

    currentY = await addSection(
      document.getElementById('granulometric-composition-table') as HTMLDivElement,
      doc,
      currentY
    );

    await addSection(document.getElementById('chart-div-granulometricCurve') as HTMLDivElement, doc, currentY);

    currentY = handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));

    currentY += 10;

    // Resumo das dosagens
    doc.setFontSize(12);
    doc.text('4. Resumo das Dosagens:'.toUpperCase(), 10, currentY);
    currentY += 10;

    const materials = materialsData.map((material) => material.name);
    const optimumBinder = [];
    let index = 0;

    materialsData.forEach((material) => {
      if (material.type !== 'asphaltBinder') {
        optimumBinder.push(
          Number(dosage.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage[index]).toFixed(2)
        );
        index++;
      } else {
        optimumBinder.push(Number(dosage.optimumBinderContentData?.optimumBinder?.optimumContent).toFixed(2));
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

    autoTable(doc, {
      head: [materials],
      body: [optimumBinder],
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

    currentY += 30;

    //Quantitativos

    doc.setFontSize(12);
    doc.text(
      t('asphalt.dosages.marshall.asphalt-mass-quantitative').toUpperCase(),
      doc.internal.pageSize.getWidth() / 2,
      currentY + 5,
      {
        align: 'center',
      }
    );
    currentY += 15;

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
        fillColor: '#F29134', // cor laranja
        textColor: [0, 0, 0] as Color, // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, segundaTabelaConfig);

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

    for (let i = 0; i < volumetricMechanicParams.length; i++) {
      doc.text(`${volumetricMechanicParams[i].label}: ${volumetricMechanicParams[i].value} %`, 10, currentY);
      currentY += 5;
    }

    const volumetricParamsHeaders = [
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
    doc.text(
      t('asphalt.dosages.marshall.asphalt-mass-quantitative').toUpperCase(),
      doc.internal.pageSize.getWidth() / 2,
      currentY + 5,
      {
        align: 'center',
      }
    );

    currentY += 10;

    const volumetricParamsTable = {
      head: [volumetricParamsHeaders],
      body: volumetricParamsRows,
      columnStyles: {
        0: { width: 100 } as any, // largura da coluna
      },
      styles: {
        fillColor: '#F29134' as Color, // cor laranja
        textColor: [0, 0, 0] as Color, // cor preta para o texto
        fontSize: 12,
      },
      startY: currentY, // Posição vertical do segundo table
    };

    autoTable(doc, volumetricParamsTable);

    currentY = handleAddPage(doc, image, currentY, t('marshall.dosage-pdf-title'));
    currentY += 10;

    doc.setFontSize(12);
    doc.text(t('asphalt.dosages.vam').toUpperCase(), doc.internal.pageSize.getWidth() / 2, currentY, {
      align: 'center',
    });

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
        fillColor: '#F29134' as Color,
        textColor: [0, 0, 0] as Color,
        fontSize: 12,
      },
      startY: currentY,
    };

    autoTable(doc, mineralAgregateVoidsTable);

    // Salvar o PDF
    doc.save(`Relatorio_Dosagem_${dosage?.generalData.name}.pdf`);
    setLoading(false);
  };

  return (
    <>
      {dosage?.confirmationCompressionData && (
        <Tooltip
          title={isDesktop ? t('dosages.tooltips.save-dosage') : t('asphalt.tooltips.disabled-pdf-generator')}
          placement="top"
          leaveTouchDelay={5000}
          open={!isDesktop && openTooltip}
          onClose={() => setOpenTooltip(false)}
        >
          <Box
            onClick={() => {
              if (isDesktop) {
                generatePDF();
              } else {
                setOpenTooltip(true);
              }
            }}
            sx={{ width: 'fit-content' }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!dosage?.confirmationCompressionData || !isDesktop}
              sx={{ minWidth: '200px', minHeight: '2rem', maxHeight: '2.5rem' }}
            >
              {loading ? <Loading size={25} color={'inherit'} /> : t('generate.dosage.button')}
            </Button>
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default GenerateMarshallDosagePDF;
