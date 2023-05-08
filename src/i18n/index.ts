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
//navbar
import navbarPTBR from './translations/navbar/ptbr.json';
import navbarENG from './translations/navbar/en.json';
//settings
import settingsPTBR from './translations/settings/ptbr.json';
import settingsENG from './translations/settings/en.json';

/** @templates */
import materialsPTBR from './translations/templates/materials/ptbr.json';
import materialsENG from './translations/templates/materials/en.json';

import welcomePTBR from './translations/templates/welcome/ptbr.json';
import welcomeENG from './translations/templates/welcome/en.json';

/**@asphalt */
import asphaltEssaysPTBR from './translations/asphalt/essays/ptbr.json';
import asphaltEssaysENG from './translations/asphalt/essays/en.json';

/**@soils */
// samples
import samplesPTBR from './translations/soils/samples/ptbr.json';
import samplesENG from './translations/soils/samples/en.json';
// essays
import soilsEssaysPTBR from './translations/soils/essays/ptbr.json';
import soilsEssaysENG from './translations/soils/essays/en.json';

/**@concrete */
import concreteEssaysPTBR from './translations/concrete/essays/ptbr.json';
import concreteEssaysENG from './translations/concrete/essays/en.json';

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
        /**@templates */
        ...materialsPTBR,
        ...welcomePTBR,
        /**@asphalt */
        ...asphaltEssaysPTBR,
        /**@soils */
        ...samplesPTBR,
        ...soilsEssaysPTBR,
        /**@concrete */
        ...concreteEssaysPTBR,
      },
    },
    en: {
      translation: {
        ...loginENG,
        ...homeENG,
        ...topbarENG,
        ...navbarENG,
        ...settingsENG,
        /**@templates */
        ...materialsENG,
        ...welcomeENG,
        /**@asphalt */
        ...asphaltEssaysENG,
        /**@soils */
        ...samplesENG,
        ...soilsEssaysENG,
        /**@concrete */
        ...concreteEssaysENG,
      },
    },
  },
});
