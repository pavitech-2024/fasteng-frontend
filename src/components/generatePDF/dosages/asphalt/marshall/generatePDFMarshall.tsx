import React from 'react';
import jsPDF from 'jspdf';
import autoTable, { Color } from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Box, Button, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import useAuth from '@/contexts/auth';
import { t } from 'i18next';
import { MarshallData } from '@/stores/asphalt/marshall/marshall.store';
import useMarshallStore from '@/stores/asphalt/marshall/marshall.store';
import logo from '@/assets/fasteng/LogoBlack.png';
import { addCapa, addImageProcess, formatDate, getCurrentDateFormatted, handleAddPage } from '../../../common';
import { useState } from 'react';
import Loading from '@/components/molecules/loading';
import Graph from '@/services/asphalt/dosages/marshall/graph/marshal-granulometry-graph';
import MiniGraphics from '@/components/asphalt/dosages/marshall/graphs/miniGraph';
// PATCH 1: Import do gráfico principal de dosagem (curva combinada)
import GraficoPage7N from '@/components/asphalt/dosages/marshall/graphs/page-7-graph';

interface IGeneratedPDF {
  dosage: MarshallData;
}

const ORANGE_RGB: Color = [242, 145, 52] as unknown as Color;
const LIGHT_GRAY: Color = [248, 248, 248] as unknown as Color;
const INFO_BLUE: Color = [227, 242, 253] as unknown as Color;

// PATCH 2: Adicionado dosageMain aos IDs
const GRAPH_IDS = {
  granulometric: 'pdf-hidden-graph-granulometric',
  dosageMain: 'pdf-hidden-graph-dosage-main',
  gmb: 'pdf-hidden-graph-gmb',
  sg: 'pdf-hidden-graph-sg',
  vv: 'pdf-hidden-graph-vv',
  vam: 'pdf-hidden-graph-vam',
  rbv: 'pdf-hidden-graph-rbv',
  stability: 'pdf-hidden-graph-stability',
};

const SECTION_TOP_OFFSET = 10;

class ChartErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Falha ao renderizar gráfico para captura no PDF (será omitido):', error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const GenerateMarshallDosagePDF = ({ dosage }: IGeneratedPDF) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(theme.breakpoints.values.notebook));

  // ===================== CÁLCULOS =====================

  const {
    confirmationCompressionData: storeData,
    optimumBinderContentData: storeOptimumBinder,
    binderTrialData: storeBinderTrialData,
  } = useMarshallStore();

  const data = dosage.confirmationCompressionData;

  const volumetricValues =
    storeData?.confirmedVolumetricParameters?.values ?? data?.confirmedVolumetricParameters?.values;

  const realMethod =
    storeData?.method ??
    storeData?.confirmedSpecificGravity?.type ??
    data?.method ??
    data?.confirmedSpecificGravity?.type ??
    'DMT';

  const densityMethodLabel = realMethod === 'GMM' ? 'GMM - Densidade máxima medida' : 'DMT - Densidade máxima teórica';

  const liveGmm = storeData?.confirmedSpecificGravity?.result ?? data?.confirmedSpecificGravity?.result;

  const teorLigante =
    storeOptimumBinder?.optimumBinder?.optimumContent ??
    dosage.optimumBinderContentData?.optimumBinder?.optimumContent ??
    0;

  const graphics = dosage.optimumBinderContentData?.graphics;
  const granulometryGraphData = dosage.granulometryCompositionData?.graphData;

  // PATCH 3: Montar os pontos do gráfico principal de dosagem
  const dosageCurvePointsRaw = dosage.optimumBinderContentData?.optimumBinder?.pointsOfCurveDosage;
  const dosageCurvePoints =
    Array.isArray(dosageCurvePointsRaw) && dosageCurvePointsRaw.length > 0
      ? [
          ['', '', ''], // header
          ...dosageCurvePointsRaw.filter(
            (row: any[]) =>
              row.length >= 3 && row[0] !== '' && row[0] !== null && row[0] !== undefined && !isNaN(Number(row[0]))
          ),
        ]
      : null;

  const isValidChartData = (arr: any): boolean =>
    Array.isArray(arr) && arr.length > 1 && Array.isArray(arr[0]) && Array.isArray(arr[1]);

  const calculateCorrectedVolumetricValues = () => {
    if (!volumetricValues) return null;
    const VAM = (volumetricValues.aggregateVolumeVoids || 0) * 100;
    const Gmb = volumetricValues.apparentBulkSpecificGravity || 0;
    const Gb = 1.027;
    const VBC = (Gmb * teorLigante) / Gb;
    const VV = VAM - VBC;
    return { vamCalculated: VAM, vbcCalculated: VBC, vvCalculated: VV };
  };

  const correctedValues = calculateCorrectedVolumetricValues();

  const calculateQuantitativeValues = (): { binder: string; aggregates: string[]; available: boolean } => {
    const aggregatesPlaceholder = dosage.materialSelectionData.aggregates.map(() => '---');

    if (!correctedValues || liveGmm == null) {
      return { binder: '---', aggregates: aggregatesPlaceholder, available: false };
    }

    const VV_percent = correctedValues.vvCalculated;

    const massaTotalTon = ((100 - VV_percent) / 100) * liveGmm;
    const massaLiganteTon = (teorLigante / 100) * massaTotalTon;
    const massaTotalAgregadosTon = massaTotalTon - massaLiganteTon;

    const livePercents =
      storeOptimumBinder?.optimumBinder?.confirmedPercentsOfDosage ??
      dosage.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage ??
      [];

    const aggregates = dosage.materialSelectionData.aggregates.map((_, idx) => {
      const percentual = livePercents[idx] || 0;
      return ((percentual / 100) * massaTotalAgregadosTon).toFixed(4);
    });

    return { binder: massaLiganteTon.toFixed(4), aggregates, available: true };
  };

  const quantitative = calculateQuantitativeValues();

  const liveBinderTrialData = storeBinderTrialData ?? dosage.binderTrialData;

  const buildBinderTrialTable = () => {
    const percentsOfDosage = liveBinderTrialData?.percentsOfDosage;
    if (!Array.isArray(percentsOfDosage) || percentsOfDosage.length === 0) return null;

    const trialOrder = ['oneLess', 'halfLess', 'normal', 'halfPlus', 'onePlus'];
    const baseTrial = liveBinderTrialData?.trial || 0;
    const trialValues: Record<string, number> = {
      oneLess: baseTrial - 1,
      halfLess: baseTrial - 0.5,
      normal: baseTrial,
      halfPlus: baseTrial + 0.5,
      onePlus: baseTrial + 1,
    };

    const materialIdToName: Record<string, string> = {};
    dosage.materialSelectionData.aggregates.forEach((m: any) => {
      materialIdToName[m._id] = m.name;
    });

    const rows = trialOrder.map((trial) => {
      const row: string[] = [trialValues[trial].toFixed(2)];
      const binderEntry = percentsOfDosage.flat().find((item: any) => item.trial === trial && !item.material);
      row.push(binderEntry ? Number(binderEntry.value).toFixed(2) : '---');

      dosage.materialSelectionData.aggregates.forEach((m: any) => {
        const entry = percentsOfDosage.flat().find((item: any) => item.trial === trial && item.material === m._id);
        row.push(entry ? Number(entry.value).toFixed(2) : '---');
      });

      return row;
    });

    const headers = [
      'Teor de ligante asfáltico (%)',
      'Ligante (%)',
      ...dosage.materialSelectionData.aggregates.map((m: any) => `${m.name} (%)`),
    ];

    return { headers, rows };
  };

  const binderTrialTable = buildBinderTrialTable();

  const machiningTemp = liveBinderTrialData?.bandsOfTemperatures?.machiningTemperatureRange;
  const compressionTemp = liveBinderTrialData?.bandsOfTemperatures?.compressionTemperatureRange;

  const sieveToBandIndex: { [key: string]: number } = {
    '3/4 pol - 19mm': 6,
    '3/8 pol - 9,5mm': 8,
    'Nº4 - 4,8mm': 10,
    'Nº8 - 2,4mm': 12,
    'Nº16 - 1,2mm': 14,
    'Nº30 - 0,6mm': 15,
    'Nº50 - 0,3mm': 17,
    'Nº100 - 0,15mm': 19,
  };

  const granulometricRows =
    dosage.granulometryCompositionData?.projections?.map((row) => {
      const bandIndex = sieveToBandIndex[row.label];
      const lower = bandIndex !== undefined ? dosage.granulometryCompositionData.bands?.lowerBand?.[bandIndex] : null;
      const higher = bandIndex !== undefined ? dosage.granulometryCompositionData.bands?.higherBand?.[bandIndex] : null;
      return {
        sieve: row.label,
        projection: row.value != null ? Number(row.value).toFixed(2) : '---',
        lowerBand: lower != null ? lower.toFixed(2) : '---',
        higherBand: higher != null ? higher.toFixed(2) : '---',
      };
    }) || [];

  const volumetricMechanicParams = volumetricValues
    ? [
        ['Teor ótimo de ligante asfáltico', `${teorLigante.toFixed(2)} %`],
        [
          realMethod === 'GMM' ? 'Densidade máxima medida (GMM)' : 'Densidade máxima teórica (DMT)',
          liveGmm != null ? `${Number(liveGmm).toFixed(2)} g/cm³` : '---',
        ],
        ['Massa específica aparente (GMB)', `${(volumetricValues.apparentBulkSpecificGravity || 0).toFixed(2)} g/cm³`],
        ['Volume de vazios (VV)', `${correctedValues ? correctedValues.vvCalculated.toFixed(2) : '---'} %`],
        ['Vazios do agregado mineral (VAM)', `${correctedValues ? correctedValues.vamCalculated.toFixed(2) : '---'} %`],
        ['VBC (Vazios com Betume)', `${correctedValues ? correctedValues.vbcCalculated.toFixed(2) : '---'} %`],
        [
          'Relação betume-vazios (RBV)',
          `${
            volumetricValues.ratioBitumenVoid != null ? (volumetricValues.ratioBitumenVoid * 100).toFixed(2) : '---'
          } %`,
        ],
        ['Estabilidade Marshall', `${(volumetricValues.stability || 0).toFixed(2)} N`],
        ['Fluência', `${(volumetricValues.fluency || 0).toFixed(2)} mm`],
        [
          'Resistência à tração por compressão diametral',
          `${(volumetricValues.indirectTensileStrength || 0).toFixed(2)} MPa`,
        ],
      ]
    : [];

  // ===================== HTML2CANVAS MELHORADO =====================

  const captureElementAsImage = async (elementId: string): Promise<string | null> => {
    const el = document.getElementById(elementId);
    if (!el) return null;
    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        ignoreElements: (element: Element) => {
          const tag = element.tagName.toLowerCase();
          const role = element.getAttribute('role');
          const ariaLabel = element.getAttribute('aria-label') || '';
          return (
            tag === 'button' ||
            role === 'button' ||
            ariaLabel.toLowerCase().includes('expand') ||
            ariaLabel.toLowerCase().includes('expandir') ||
            element.classList.contains('MuiButtonBase-root') ||
            element.classList.contains('MuiIconButton-root')
          );
        },
      });
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error(`Falha ao capturar gráfico (${elementId}):`, err);
      return null;
    }
  };

  const addImageFitWidth = (doc: jsPDF, imgData: string, x: number, y: number, maxWidthMM: number): number => {
    const props = doc.getImageProperties(imgData);
    const ratio = props.height / props.width;
    const h = maxWidthMM * ratio;
    doc.addImage(imgData, 'PNG', x, y, maxWidthMM, h);
    return h;
  };

  const GRAPH_RENDER_DELAY_MS = 800;
  const waitForGraphsRender = () => new Promise((resolve) => setTimeout(resolve, GRAPH_RENDER_DELAY_MS));

  // ===================== HELPERS DE LAYOUT =====================

  const PAGE_BOTTOM_LIMIT = 275;

  const addPageWithoutDate = (doc: jsPDF, image: HTMLImageElement, currentY: number, title: string): number => {
    doc.addPage();

    if (image) {
      const maxHeight = 7;
      const maxWidth = 35;
      const ratio = image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 2;
      let width = maxHeight * ratio;

      if (width > maxWidth) {
        width = maxWidth;
      }

      doc.addImage(image, 'PNG', 10, 5, width, maxHeight);
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(title, 105, 10, { align: 'center' });
    doc.setFont(undefined, 'normal');

    doc.setDrawColor(242, 145, 52);
    doc.setLineWidth(0.5);
    doc.line(10, 16, 200, 16);

    return 22;
  };

  let pageCount = 1;

  const ensureSpace = (doc: jsPDF, image: HTMLImageElement, currentY: number, neededHeight: number): number => {
    if (currentY + neededHeight > PAGE_BOTTOM_LIMIT) {
      pageCount++;
      return addPageWithoutDate(doc, image, currentY, t('marshall.dosage-pdf-title')) + SECTION_TOP_OFFSET;
    }
    return currentY;
  };

  const drawSectionTitle = (doc: jsPDF, text: string, x: number, y: number): number => {
    doc.setFillColor(242, 145, 52);
    doc.rect(x, y - 4.5, 3, 6, 'F');
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(text, x + 6, y);
    doc.setFont(undefined, 'normal');
    return y + 8;
  };

  const drawKeyValueTable = (doc: jsPDF, rows: string[][], startY: number, labelWidth = 75): number => {
    autoTable(doc, {
      body: rows,
      startY,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, lineColor: [220, 220, 220], lineWidth: 0.1 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: labelWidth, fillColor: [253, 240, 225] as unknown as Color },
        1: { cellWidth: 'auto' },
      },
      alternateRowStyles: { fillColor: LIGHT_GRAY },
    });
    return (doc as any).lastAutoTable.finalY + 8;
  };

  const drawInfoBox = (doc: jsPDF, text: string, startY: number): number => {
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, 180);
    const boxHeight = lines.length * 5 + 6;
    doc.setFillColor(227, 242, 253);
    doc.rect(10, startY, 190, boxHeight, 'F');
    doc.setTextColor(13, 71, 161);
    doc.text(lines, 14, startY + 6);
    doc.setTextColor(0, 0, 0);
    return startY + boxHeight + 8;
  };

  // ===================== GERAÇÃO DO PDF =====================

  const generatePDF = async () => {
    setLoading(true);
    try {
      await waitForGraphsRender();

      // PATCH 4: Capturar dosageMain também
      const [granulometricImg, dosageMainImg, gmbImg, sgImg, vvImg, vamImg, rbvImg, stabilityImg] = await Promise.all([
        captureElementAsImage(GRAPH_IDS.granulometric),
        captureElementAsImage(GRAPH_IDS.dosageMain),
        captureElementAsImage(GRAPH_IDS.gmb),
        captureElementAsImage(GRAPH_IDS.sg),
        captureElementAsImage(GRAPH_IDS.vv),
        captureElementAsImage(GRAPH_IDS.vam),
        captureElementAsImage(GRAPH_IDS.rbv),
        captureElementAsImage(GRAPH_IDS.stability),
      ]);

      const doc = new jsPDF('p', 'mm', 'a4');
      const image = (await addImageProcess(logo.src)) as HTMLImageElement;
      let currentY = 30;

      // PÁGINA 1: CAPA
      addCapa(
        doc,
        image,
        'marshall',
        dosage.createdAt ? dosage.createdAt.toString() : new Date().toString(),
        dosage.generalData.name,
        dosage.generalData.operator,
        dosage.generalData.laboratory
      );

      // PÁGINA 2: Conteúdo (SEM DATA)
      pageCount = 2;
      currentY = addPageWithoutDate(doc, image, 30, t('marshall.dosage-pdf-title')) + SECTION_TOP_OFFSET;

      // ===== Método de densidade (TOPO) =====
      currentY = ensureSpace(doc, image, currentY, 20);
      currentY = drawInfoBox(doc, `Método de densidade: ${densityMethodLabel}`, currentY);

      // ===== 1.0 - APRESENTAÇÃO =====
      currentY = drawSectionTitle(doc, '1.0 - APRESENTAÇÃO', 10, currentY);

      const apresentacaoTexto = `Neste relatório os resultados das atividades desenvolvidas referentes à dosagem Marshall de Concreto Betuminoso Usinado a Quente - CBUQ. O presente relatório inclui os resultados de caracterização dos materiais utilizados na dosagem, o procedimento para determinação do teor ótimo de Cimento Asfáltico de Petróleo - CAP e os resultados dos ensaios mecânicos realizados neste teor.`;

      doc.setFontSize(10);
      const apresentacaoLines = doc.splitTextToSize(apresentacaoTexto, 190);
      doc.text(apresentacaoLines, 10, currentY);
      currentY += apresentacaoLines.length * 5 + 8;

      const materialNames = dosage.materialSelectionData.aggregates.map((m) => m.name).join(', ');
      const objectiveLabel =
        dosage.generalData.objective === 'bearing'
          ? t('asphalt.dosages.marshall.bearing-layer')
          : dosage.generalData.objective === 'bonding'
          ? t('asphalt.dosages.marshall.bonding-layer')
          : '---';

      const projectInfoRows: string[][] = [
        [t('asphalt.dosages.marshall.generated-by'), user?.name || '---'],
        [t('asphalt.dosages.marshall.email'), user?.email || '---'],
        [t('asphalt.project_name'), dosage.generalData.name || '---'],
        [t('asphalt.used-materials'), materialNames || '---'],
        [t('asphalt.dosages.marshall.dnit-track'), dosage.generalData.dnitBand || '---'],
        [t('asphalt.project-initial-date'), dosage.createdAt ? formatDate(dosage.createdAt.toString()) : '---'],
        [t('asphalt.objective'), objectiveLabel],
        [
          t('asphalt.dosages.marshall.initial_binder'),
          dosage.binderTrialData?.trial != null ? `${dosage.binderTrialData.trial}%` : '---',
        ],
        [t('asphalt.dosages.project-author'), dosage.generalData.operator || '---'],
        [t('asphalt.dosages.project-laboratory'), dosage.generalData.laboratory || '---'],
      ];

      currentY = ensureSpace(doc, image, currentY, 20);
      currentY = drawKeyValueTable(doc, projectInfoRows, currentY);

      // ===== TABELA 1.1 - PROPORÇÕES DOS MATERIAIS =====
      currentY = ensureSpace(doc, image, currentY, 30);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Tabela 1.1 - Proporções dos materiais', 10, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;

      const materials = dosage.materialSelectionData.aggregates.map((m) => m.name);
      const optimumBinder =
        dosage.optimumBinderContentData?.optimumBinder?.confirmedPercentsOfDosage?.map((v) => Number(v).toFixed(2)) ||
        [];

      autoTable(doc, {
        head: [[...materials, 'Ligante']],
        body: [[...optimumBinder, teorLigante.toFixed(2)]],
        styles: { fontSize: 9 },
        headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        startY: currentY,
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;

      // ===== TEORES DE LIGANTE AVALIADOS E TEMPERATURAS (Step 4) =====
      if (binderTrialTable) {
        currentY = ensureSpace(doc, image, currentY, 50);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Teores de ligante avaliados', 10, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 6;

        autoTable(doc, {
          head: [binderTrialTable.headers],
          body: binderTrialTable.rows,
          styles: { fontSize: 8 },
          headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
          alternateRowStyles: { fillColor: LIGHT_GRAY },
          startY: currentY,
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
      }

      if (machiningTemp?.average != null || compressionTemp?.average != null) {
        currentY = ensureSpace(doc, image, currentY, 50);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Temperaturas de usinagem e compressão', 10, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 6;

        autoTable(doc, {
          head: [['', 'Mínima', 'Média', 'Máxima']],
          body: [
            [
              'Temperatura de usinagem (°C)',
              machiningTemp?.lower != null ? machiningTemp.lower.toFixed(2) : '---',
              machiningTemp?.average != null ? machiningTemp.average.toFixed(2) : '---',
              machiningTemp?.higher != null ? machiningTemp.higher.toFixed(2) : '---',
            ],
            [
              'Temperatura de compressão (°C)',
              compressionTemp?.lower != null ? compressionTemp.lower.toFixed(2) : '---',
              compressionTemp?.average != null ? compressionTemp.average.toFixed(2) : '---',
              compressionTemp?.higher != null ? compressionTemp.higher.toFixed(2) : '---',
            ],
          ],
          styles: { fontSize: 9 },
          headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
          alternateRowStyles: { fillColor: LIGHT_GRAY },
          startY: currentY,
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
      }

      // ===== TABELA 1.2 - QUANTITATIVO =====
      currentY = ensureSpace(doc, image, currentY, 35);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Tabela 1.2 - Quantitativo para 1 m³ de massa asfáltica', 10, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;

      autoTable(doc, {
        head: [[`${t('asphalt.dosages.marshall.asphaltic-binder')} (t/m³)`, ...materials.map((m) => `${m} (t/m³)`)]],
        body: [[quantitative.binder, ...quantitative.aggregates]],
        styles: { fontSize: 9 },
        headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        startY: currentY,
      });
      currentY = (doc as any).lastAutoTable.finalY + 6;

      if (!quantitative.available) {
        doc.setFontSize(8);
        doc.setTextColor(150, 100, 0);
        const note = doc.splitTextToSize(
          'Quantitativo incompleto: confirme o Gmm e os parâmetros volumétricos na etapa de compressão.',
          190
        );
        doc.text(note, 10, currentY);
        currentY += note.length * 4 + 6;
        doc.setTextColor(0, 0, 0);
      } else {
        currentY += 4;
      }

      // ===== TABELA 1.3 - PARÂMETROS VOLUMÉTRICOS =====
      currentY = ensureSpace(doc, image, currentY, 40);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(
        'Tabela 1.3 - Parâmetros volumétricos e mecânicos da mistura no teor ótimo de ligante asfáltico',
        10,
        currentY
      );
      doc.setFont(undefined, 'normal');
      currentY += 6;

      autoTable(doc, {
        head: [['Parâmetro', 'Resultado']],
        body: volumetricMechanicParams,
        styles: { fontSize: 9 },
        headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        startY: currentY,
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;

      // ===== 2.0 - CARACTERIZAÇÃO DOS MATERIAIS =====
      currentY = ensureSpace(doc, image, currentY, 40);
      currentY = drawSectionTitle(doc, '2.0 - CARACTERIZAÇÃO DOS MATERIAIS', 10, currentY);

      doc.setFontSize(10);
      doc.text('Materiais utilizados na dosagem:', 10, currentY);
      currentY += 6;

      autoTable(doc, {
        head: [['Material', 'Tipo']],
        body: dosage.materialSelectionData.aggregates.map((m: any) => [m.name, m.type || '---']),
        styles: { fontSize: 9 },
        headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        startY: currentY,
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;

      // ===== 3.0 - DOSAGEM MARSHALL =====
      currentY = ensureSpace(doc, image, currentY, 40);
      currentY = drawSectionTitle(doc, '3.0 - DOSAGEM MARSHALL', 10, currentY);

      doc.setFontSize(10);
      doc.text(
        `Faixa DNIT adotada: ${dosage.generalData.dnitBand} | Teor inicial avaliado: ${dosage.binderTrialData?.trial}%`,
        10,
        currentY
      );
      currentY += 8;

      // Composição granulométrica
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text('Composição granulométrica de projeto', 10, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;

      if (granulometricRows.length > 0) {
        autoTable(doc, {
          head: [['Peneira', 'Projeção (%)', 'Faixa Inferior (%)', 'Faixa Superior (%)']],
          body: granulometricRows.map((r) => [r.sieve, r.projection, r.lowerBand, r.higherBand]),
          styles: { fontSize: 9 },
          headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
          alternateRowStyles: { fillColor: LIGHT_GRAY },
          startY: currentY,
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
      } else {
        doc.setFontSize(10);
        doc.text('Dados de composição granulométrica não disponíveis.', 10, currentY);
        currentY += 10;
      }

      // Gráfico granulométrico
      if (granulometricImg) {
        currentY = ensureSpace(doc, image, currentY, 100);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Figura 3.1 - Curva granulométrica de projeto', 10, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 6;
        const h = addImageFitWidth(doc, granulometricImg, 10, currentY, 190);
        currentY += h + 8;
      }

      // Gráficos de dosagem
      currentY = ensureSpace(doc, image, currentY, 90);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Figura 3.2 - Curvas de dosagem em função do teor de ligante', 10, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 8;

      // PATCH 5: Gráfico principal (curva combinada) em largura cheia, antes da grade
      if (dosageMainImg) {
        currentY = ensureSpace(doc, image, currentY, 100);
        const h = addImageFitWidth(doc, dosageMainImg, 10, currentY, 190);
        currentY += h + 8;
      }

      const dosageGraphs = [gmbImg, sgImg, vvImg, vamImg, rbvImg, stabilityImg].filter(Boolean) as string[];
      const colWidth = 90;
      const gap = 10;

      const firstRowY = currentY - 35;
      const secondRowY = currentY + 20;
      const thirdRowY = currentY + 75;

      dosageGraphs.forEach((img, idx) => {
        const col = idx % 2;
        const x = 10 + col * (colWidth + gap);

        const props = doc.getImageProperties(dosageGraphs[0]);
        const ratio = props.height / props.width;
        const graphHeight = colWidth * ratio;

        currentY = thirdRowY + graphHeight + 8;
        const h = colWidth * ratio; // mantém o tamanho original

        let y = firstRowY;

        if (idx >= 2 && idx < 4) y = secondRowY;
        if (idx >= 4) y = thirdRowY;

        doc.addImage(img, 'PNG', x, y, colWidth, h);
      });

      currentY = thirdRowY + colWidth * 0.7 + 8;

      if (dosageGraphs.length === 0) {
        doc.setFontSize(10);
        doc.text('Curvas de dosagem não disponíveis (dados insuficientes).', 10, currentY);
        currentY += 10;
      }

      // Faixas de especificação - DNIT
      currentY = ensureSpace(doc, image, currentY, 40);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Faixas de especificação - DNIT', 10, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;

      autoTable(doc, {
        head: [
          [
            'Parâmetro',
            'Unidade',
            t('asphalt.dosages.marshall.bearing-layer'),
            t('asphalt.dosages.marshall.bonding-layer'),
          ],
        ],
        body: [
          [t('asphalt.dosages.stability'), 'Kgf', '≥500', '≥500'],
          [t('asphalt.dosages.rbv'), '%', '75 - 82', '65 - 72'],
          [t('asphalt.dosages.mixture-voids'), '%', '3 - 5', '4 - 6'],
          [`${t('asphalt.dosages.indirect-tensile-strength')} (25 °C)`, 'MPa', '≥ 0,65', '≥ 0,65'],
        ],
        styles: { fontSize: 9 },
        headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        startY: currentY,
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Vazios mínimos do agregado mineral (VAM)
      currentY = ensureSpace(doc, image, currentY, 35);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Vazios mínimos do agregado mineral (VAM)', 10, currentY);
      doc.setFont(undefined, 'normal');
      currentY += 6;

      autoTable(doc, {
        head: [['TMN', 'Vam (%)']],
        body: [
          ['9,5mm', '≥ 18'],
          ['12,5mm', '≥ 16'],
          ['19,1mm', '≥ 15'],
        ],
        styles: { fontSize: 9 },
        headStyles: { fillColor: ORANGE_RGB, textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        startY: currentY,
      });
      currentY = (doc as any).lastAutoTable.finalY + 8;

      // ===== 4.0 - ENSAIOS COMPLEMENTARES =====
      if (dosage.fatigueCurveData || dosage.resilienceModuleData) {
        currentY = ensureSpace(doc, image, currentY, 40);
        currentY = drawSectionTitle(doc, '4.0 - ENSAIOS COMPLEMENTARES', 10, currentY);

        if (dosage.fatigueCurveData) {
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text('Curva de Fadiga à Compressão Diametral', 10, currentY);
          doc.setFont(undefined, 'normal');
          currentY += 6;

          const fatigueRows: string[][] = [
            ['K1', dosage.fatigueCurveData.k1 != null ? String(dosage.fatigueCurveData.k1) : '---'],
            ['K2', dosage.fatigueCurveData.k2 != null ? String(dosage.fatigueCurveData.k2) : '---'],
            ['Observações', dosage.fatigueCurveData.observacoes || '---'],
          ];
          currentY = drawKeyValueTable(doc, fatigueRows, currentY, 50);
        }

        if (dosage.resilienceModuleData) {
          currentY = ensureSpace(doc, image, currentY, 40);
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.text('Módulo de Resiliência', 10, currentY);
          doc.setFont(undefined, 'normal');
          currentY += 6;

          const resilienceRows: string[][] = [
            [
              'Módulo Médio',
              dosage.resilienceModuleData.moduloMedio != null
                ? `${dosage.resilienceModuleData.moduloMedio} MPa`
                : '---',
            ],
            [
              'Módulo Instantâneo',
              dosage.resilienceModuleData.moduloInstantaneo != null
                ? `${dosage.resilienceModuleData.moduloInstantaneo} MPa`
                : '---',
            ],
            ['Observações', dosage.resilienceModuleData.observacoes || '---'],
          ];
          currentY = drawKeyValueTable(doc, resilienceRows, currentY, 50);
        }
      }

      doc.save(`Relatorio_Dosagem_${dosage?.generalData?.name || 'marshall'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF Marshall:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {dosage?.confirmationCompressionData && (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: '-9999px',
              width: '750px',
              backgroundColor: '#ffffff',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            {isValidChartData(granulometryGraphData) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.granulometric} sx={{ width: '750px', height: '480px', padding: '10px' }}>
                  <Graph data={granulometryGraphData} />
                </Box>
              </ChartErrorBoundary>
            )}

            {/* PATCH 6: Caixa do gráfico principal de dosagem (curva combinada) */}
            {dosageCurvePoints && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.dosageMain} sx={{ width: '750px', height: '450px', padding: '10px' }}>
                  <GraficoPage7N data={dosageCurvePoints} />
                </Box>
              </ChartErrorBoundary>
            )}

            {isValidChartData(graphics?.gmb) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.gmb} sx={{ width: '550px', height: '380px', padding: '10px' }}>
                  <MiniGraphics data={graphics.gmb} type={'gmb'} nameEixoY={t('asphalt.dosages.gmb') + '(g/cm³)'} />
                </Box>
              </ChartErrorBoundary>
            )}

            {isValidChartData(graphics?.sg) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.sg} sx={{ width: '550px', height: '380px', padding: '10px' }}>
                  <MiniGraphics
                    data={graphics.sg}
                    type={realMethod || 'GMM'}
                    nameEixoY={
                      realMethod === 'DMT'
                        ? 'Massa específica máxima teórica (g/cm³)'
                        : 'Massa específica máxima medida (g/cm³)'
                    }
                  />
                </Box>
              </ChartErrorBoundary>
            )}

            {isValidChartData(graphics?.vv) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.vv} sx={{ width: '550px', height: '380px', padding: '10px' }}>
                  <MiniGraphics data={graphics.vv} type={'Vv'} nameEixoY={t('asphalt.dosages.vv') + '(%)'} />
                </Box>
              </ChartErrorBoundary>
            )}

            {isValidChartData(graphics?.vam) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.vam} sx={{ width: '550px', height: '380px', padding: '10px' }}>
                  <MiniGraphics data={graphics.vam} type={'Vam'} nameEixoY={t('asphalt.dosages.vam') + '(%)'} />
                </Box>
              </ChartErrorBoundary>
            )}

            {isValidChartData(graphics?.rbv) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.rbv} sx={{ width: '550px', height: '380px', padding: '10px' }}>
                  <MiniGraphics data={graphics.rbv} type={'Rbv'} nameEixoY={t('asphalt.dosages.rbv') + '(%)'} />
                </Box>
              </ChartErrorBoundary>
            )}

            {isValidChartData(graphics?.stability) && (
              <ChartErrorBoundary>
                <Box id={GRAPH_IDS.stability} sx={{ width: '550px', height: '380px', padding: '10px' }}>
                  <MiniGraphics
                    data={graphics.stability}
                    type={'Estabilidade'}
                    nameEixoY={t('asphalt.dosages.stability') + '(N)'}
                  />
                </Box>
              </ChartErrorBoundary>
            )}
          </Box>

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
        </>
      )}
    </>
  );
};

export default GenerateMarshallDosagePDF;
