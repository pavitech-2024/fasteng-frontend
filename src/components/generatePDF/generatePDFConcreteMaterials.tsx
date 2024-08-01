import { EssaysData } from '@/pages/concrete/materials/material/[id]';
import jsPDF from 'jspdf';
import React from 'react';
import logo from '../../../assets/fasteng/LogoBlack.png';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { t } from 'i18next';
import { Button } from '@mui/material';

export interface IGenratePDFConcreteMaterials {
    name: string;
    type: string;
    granulometryData: EssaysData['concreteGranulometryData'];
    chapmanData: EssaysData['chapmanData'];
    sandIncreaseData: EssaysData['sandIncreaseData'];
    unitMassData: EssaysData['unitMassData'];
}

const GeneratePDFConcreteMaterials = ({
    name,
    type,
    granulometryData,
    chapmanData,
    sandIncreaseData,
    unitMassData
}: IGenratePDFConcreteMaterials) => {

    const dataGranulometryData = {
        container_other_data: [],
    };

    //const dataSandIncreaseData = [];

    //const unitMassResult = Number(unitMassData.result).toFixed(1);

    //chapmanData.results.m_e.toFixed(user_decimal)

    if (granulometryData) {
        dataGranulometryData.container_other_data.push(
          { label: t('granulometry-concrete.total-retained'), value: granulometryData.results.total_retained, unity: 'g' },
          { label: t('granulometry-concrete.nominal-size'), value: granulometryData.results.nominal_size, unity: 'mm' },
          {
            label: t('granulometry-concrete.nominal-diameter'),
            value: granulometryData.results.nominal_diameter,
            unity: 'mm',
          },
          {
            label: t('granulometry-concrete.fineness-module'),
            value: granulometryData.results.fineness_module,
            unity: '%',
          },
          { label: t('granulometry-concrete.cc'), value: granulometryData.results.cc },
          { label: t('granulometry-concrete.cnu'), value: granulometryData.results.cnu },
          { label: t('granulometry-concrete.error'), value: granulometryData.results.error, unity: '%' }
        );
    }
}