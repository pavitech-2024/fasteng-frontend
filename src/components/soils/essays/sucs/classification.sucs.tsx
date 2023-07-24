import { t } from 'i18next';

const verifyClassification = (classification: string, firstOption: string, secondOption: string) =>
  classification != null ? classification.split('-').some(elem => elem.includes(firstOption) || elem.includes(secondOption)) : false

const showDefinition = (classification: string) => {
  if (verifyClassification(classification, 'GW', 'SW'))
    return t('sucs.text-GW||SW')
  if (verifyClassification(classification, 'GP', 'SP'))
    return t('sucs.text-GP||SP')
  if (verifyClassification(classification, 'GM', 'SM'))
    return t('sucs.text-GM||SM')
  if (verifyClassification(classification, 'GC', 'SC'))
    return t('sucs.text-GC||SC')
  if (verifyClassification(classification, 'ML', 'MH'))
    return t('sucs.text-ML||MH')
  if (verifyClassification(classification, 'CL', 'CH'))
    return t('sucs.text-CL||CH')
  if (verifyClassification(classification, 'OL', 'OH'))
    return t('sucs.text-OL||OH')
}

export default showDefinition;