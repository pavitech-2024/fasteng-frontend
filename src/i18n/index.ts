// i18n é a biblioteca que vamos utilizar para traduzir o nosso app
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// login
import loginPTBR from './translations/login/ptbr.json';
import loginENG from './translations/login/en.json';
// home
import homePTBR from './translations/home/ptbr.json';
import homeENG from './translations/home/en.json';
// topbar
import topbarPTBR from './translations/topbar/ptbr.json';
import topbarENG from './translations/topbar/en.json';
//footer
import footerPTBR from './translations/footer/ptbr.json';
import footerENG from './translations/footer/en.json';
//navbar
import navbarPTBR from './translations/navbar/ptbr.json';
import navbarENG from './translations/navbar/en.json';
//settings
import settingsPTBR from './translations/settings/ptbr.json';
import settingsENG from './translations/settings/en.json';
//errors
import errorsPTBR from './translations/errors/ptbr.json';
import errorsENG from './translations/errors/en.json';

/** @templates */
import materialsPTBR from './translations/templates/materials/ptbr.json';
import materialsENG from './translations/templates/materials/en.json';

import welcomePTBR from './translations/templates/welcome/ptbr.json';
import welcomeENG from './translations/templates/welcome/en.json';

/**@asphalt */
// materials
import asphaltMaterialsPTBR from './translations/asphalt/materials/ptbr.json';
import asphaltMaterialsENG from './translations/asphalt/materials/en.json';
// essays
import asphaltEssaysPTBR from './translations/asphalt/essays/ptbr.json';
import asphaltEssaysENG from './translations/asphalt/essays/en.json';

/**@soils */
// samples
import samplesPTBR from './translations/soils/samples/ptbr.json';
import samplesENG from './translations/soils/samples/en.json';
// essays
import soilsEssaysPTBR from './translations/soils/essays/ptbr.json';
import soilsEssaysENG from './translations/soils/essays/en.json';
// cbr
import cbrPTBR from './translations/soils/essays/cbr/ptbr.json';
import cbrENG from './translations/soils/essays/cbr/en.json';
// hrb
import hrbPTBR from './translations/soils/essays/hrb/ptbr.json';
import hrbENG from './translations/soils/essays/hrb/en.json';
// sucs
import sucsPTBR from './translations/soils/essays/sucs/ptbr.json';
import sucsENG from './translations/soils/essays/sucs/en.json';
// granulometry
import soilsGranulometryPTBR from './translations/soils/essays/granulometry/ptbr.json';
import soilsGranulometryENG from './translations/soils/essays/granulometry/en.json';
// compression
import compressionPTBR from './translations/soils/essays/compression/ptbr.json';
import compressionENG from './translations/soils/essays/compression/en.json';

/**@concrete */
// essays
import concreteEssaysPTBR from './translations/concrete/essays/ptbr.json';
import concreteEssaysENG from './translations/concrete/essays/en.json';
// materials
import concreteMaterialsPTBR from './translations/concrete/materials/ptbr.json';
import concreteMaterialsENG from './translations/concrete/materials/en.json';
// unit mass
import unitMassPTBR from './translations/concrete/essays/unitMass/ptbr.json';
import unitMassENG from './translations/concrete/essays/unitMass/en.json';
// sandIncrease
import sandIncreasePTBR from './translations/concrete/essays/sandIncrease/ptbr.json';
import sandIncreaseENG from './translations/concrete/essays/sandIncrease/en.json';
// granulometry
import concreteGranulometryPTBR from './translations/concrete/essays/granulometry/ptbr.json';
import concreteGranulometryENG from './translations/concrete/essays/granulometry/en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'ptBR',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ptBR: {
      translation: {
        ...loginPTBR,
        ...homePTBR,
        ...topbarPTBR,
        ...navbarPTBR,
        ...settingsPTBR,
        ...footerPTBR,
        ...errorsPTBR,
        /**@templates */
        ...materialsPTBR,
        ...welcomePTBR,
        /**@asphalt */
        ...asphaltMaterialsPTBR,
        ...asphaltEssaysPTBR,
        /**@soils */
        ...samplesPTBR,
        ...soilsEssaysPTBR,
        ...cbrPTBR,
        ...hrbPTBR,
        ...sucsPTBR,
        ...soilsGranulometryPTBR,
        ...compressionPTBR,
        /**@concrete */
        ...concreteEssaysPTBR,
        ...concreteMaterialsPTBR,
        ...unitMassPTBR,
        ...sandIncreasePTBR,
        ...concreteGranulometryPTBR,
      },
    },
    en: {
      translation: {
        ...loginENG,
        ...homeENG,
        ...topbarENG,
        ...navbarENG,
        ...settingsENG,
        ...footerENG,
        ...errorsENG,
        /**@templates */
        ...materialsENG,
        ...welcomeENG,
        /**@asphalt */
        ...asphaltMaterialsENG,
        ...asphaltEssaysENG,
        /**@soils */
        ...samplesENG,
        ...soilsEssaysENG,
        ...cbrENG,
        ...hrbENG,
        ...sucsENG,
        ...soilsGranulometryENG,
        ...compressionENG,
        /**@concrete */
        ...concreteEssaysENG,
        ...concreteMaterialsENG,
        ...unitMassENG,
        ...sandIncreaseENG,
        ...concreteGranulometryENG,
      },
    },
  },
});
