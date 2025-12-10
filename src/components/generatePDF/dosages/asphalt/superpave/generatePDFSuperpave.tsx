import {
  addImageProcess,
  addCapa,
  SummaryItem,
  addSummary,
  handleAddPage,
  formatDate,
  getCurrentDateFormatted,
} from '@/components/generatePDF/common';
import useAuth from '@/contexts/auth';
import { Box, Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { t } from 'i18next';
import jsPDF from 'jspdf';
import logo from '@/assets/fasteng/LogoBlack.png';
import { SuperpaveData } from '@/stores/asphalt/superpave/superpave.store';
import autoTable, { Color } from 'jspdf-autotable';
import { useState } from 'react';
import Loading from '@/components/molecules/loading';

interface IGeneratedPDF {
  dosage: SuperpaveData;
}

const GenerateSuperpaveDosagePDF = ({ dosage }: IGeneratedPDF) => {
  const { user } = useAuth();
  const materialsData = dosage?.granulometryEssayData.materials;
  const materialsEssays = dosage?.granulometryResultsData;
  const [loading, setLoading] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.notebook));

  const generatePDF = async () => {
    setLoading(true);

    const doc = new jsPDF('p', 'mm', 'a4');
    const image = (await addImageProcess(logo.src)) as HTMLImageElement;
    let currentY = 30;

    // ✅ CORREÇÃO: Verificar se createdAt existe antes de usar toString()
    const createdAt = dosage.createdAt ? dosage.createdAt.toString() : new Date().toString();
    const initialDate = dosage.createdAt ? formatDate(dosage.createdAt.toString()) : '---';

    addCapa(
      doc,
      image,
      'superpave',
      createdAt,
      dosage.generalData.name,
      dosage.generalData.operator,
      dosage.generalData.laboratory
    );

    handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));

    const summaryItems: SummaryItem[] = [
      {
        title: t('dosages.report.general-data'),
        page: 3,
        key: 'generalData',
      },
      {
        title: t('dosages.report.materials-caracterization'),
        page: 4,
        key: 'materialsCaracterization',
      },
      {
        title: t('dosages.report.results'),
        page: 3,
        key: 'results',
      },
      {
        title: t('asphalt.dosages.superpave.asphalt-mass-quantitative'),
        page: 3,
        key: 'asphaltMassQuantitative',
      },
      {
        title: t('asphalt.dosages.binder-volumetric-mechanic-params'),
        page: 3,
        key: 'binderVolumetricMechanicParams',
      },
    ];

    const materialNames = materialsData.map((material) => material.name).join(', ');

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
        key: 'dnitBand',
        label: t('asphalt.dosages.marshall.dnit-track'),
        value: dosage.generalData.dnitBand,
      },
      {
        key: 'initialDate',
        label: t('asphalt.project-initial-date'),
        value: initialDate,
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

    // ✅ CORREÇÃO: Verificar se dosageResume existe antes de acessar propriedades
    const volumetricsBody = dosage.dosageResume ? [
      {
        label: t('asphalt.dosages.superpave.apparent-specific-mass') + ' (Gmb)',
        value: dosage.dosageResume.Gmb?.toFixed(2) || '---',
        unity: 'g/cm3',
      },
      {
        label: t('asphalt.dosages.superpave.void-volume') + ' (Vv)',
        value: dosage.dosageResume.Vv ? (dosage.dosageResume.Vv * 100).toFixed(2) : '---',
        unity: '%',
      },
      {
        label: t('Vazios do agregado mineral (VAM)'),
        value: dosage.dosageResume.Vam?.toFixed(2) || '---',
        unity: '%',
      },
      {
        label: t('asphalt.dosages.rbv') + ' (RBV)',
        value: dosage.dosageResume.RBV ? (dosage.dosageResume.RBV * 100).toFixed(2) : '---',
        unity: '%',
      },
      {
        label: t('asphalt.dosages.absorbed-water'),
        value: dosage.dosageResume.percentWaterAbs?.toFixed(2) || '---',
        unity: '%',
      },
      {
        label: t('asphalt.dosages.superpave.specific-mass'),
        value: dosage.dosageResume.specifiesMass?.toFixed(2) || '---',
        unity: 'g/cm',
      },
    ] : [];

    const isBinderOrCAP = (type) => type === 'asphaltBinder' || type === 'CAP';

    const prioritized = materialsData.filter((material) => isBinderOrCAP(material.type));

    const others = materialsData.filter((material) => !isBinderOrCAP(material.type));

    // ✅ CORREÇÃO: Verificar se material.createdAt existe
    const formatMaterial = (material) => ({
      name: material.name,
      type: material.type,
      creationDate: material.createdAt ? formatDate(material.createdAt.toString()) : '---',
      source: material.description.source ? material.description.source : '---',
      receivedDate: material.description.recieveDate
        ? formatDate(material.description.recieveDate.toString())
        : '--/--/----',
      classification: '?',
    });

    const materialsArray = [...prioritized.map(formatMaterial), ...others.map(formatMaterial)];

    addSummary(
      doc,
      summaryItems,
      materialsData.find((material) => material.type === 'asphaltBinder' || material.type === 'CAP')?.name || '---',
      materialsData.filter(
        (material) => material.type.toLowerCase().includes('aggregate') || material.type.toLowerCase() === 'filler'
      ),
      t('superpave.dosage-pdf-title')
    );

    const essayResults = { ...materialsEssays.granulometrys, ...materialsEssays.viscosity };

    handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));

    currentY += 10;

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
      currentY = 40;
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

      handleAddPage(doc, image, 30, t('superpave.dosage-pdf-title'));
    });

    currentY = 40;

    // Resumo das dosagens
    doc.setFontSize(12);
    doc.text('Resumo das Dosagens:'.toUpperCase(), 10, currentY);
    currentY += 10;

    const materials = materialsData.map((material) => material.name);
    const optimumBinder = [];
    let index = 0;

    // ✅ CORREÇÃO: Verificar se optimumContent é um número antes de usar toFixed()
    materialsData.forEach((material) => {
      if (material.type !== 'asphaltBinder') {
        const optimumContent = dosage.secondCompressionPercentagesData?.optimumContent;
        
        // Converter para número se for string ou usar valor direto se for número
        let contentValue: number | null = null;
        
        if (optimumContent != null) {
          if (typeof optimumContent === 'string') {
            contentValue = parseFloat(optimumContent);
          } else if (typeof optimumContent === 'number') {
            contentValue = optimumContent;
          }
        }
        
        // Só adicionar se for um número válido
        if (contentValue != null && !isNaN(contentValue)) {
          optimumBinder.push(Number(contentValue.toFixed(2)));
        } else {
          optimumBinder.push('---');
        }
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

    // ✅ CORREÇÃO: Verificar se ponderatedPercentsOfDosage existe
    const finalProportionsBody =
      dosage?.dosageResume?.ponderatedPercentsOfDosage?.map((percent) => 
        percent != null ? percent.toFixed(2) : '---'
      ) || [];

    autoTable(doc, {
      head: [materials],
      body: [finalProportionsBody],
      columnStyles: {
        0: { width: 100 } as any,
      },
      styles: {
        fillColor: '#F29134',
        textColor: [0, 0, 0],
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

    // ✅ CORREÇÃO: Verificar se quantitative existe
    const quantitativesBody = dosage.dosageResume?.quantitative?.map((item) => 
      item != null ? item.toFixed(2) : '---'
    ) || [];

    autoTable(doc, {
      head: [materials],
      body: [quantitativesBody],
      columnStyles: {
        0: { width: 100 } as any,
      },
      styles: {
        fillColor: '#F29134',
        textColor: [0, 0, 0] as Color,
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
    setLoading(false);
  };

  return (
    <>
      {dosage?.confirmationCompressionData && isDesktop && (
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

export default GenerateSuperpaveDosagePDF;