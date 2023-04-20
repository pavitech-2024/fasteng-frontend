// i18n é a biblioteca que vamos utilizar para traduzir o nosso app
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ptBR
import loginPTBR from './translations/login/ptbr.json';
import homePTBR from './translations/home/ptbr.json';

//en
import loginENG from './translations/login/en.json';
import homeENG from './translations/home/en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ptBR: {
      ...loginPTBR,
      ...homePTBR,
    },
    en: {
      ...loginENG,
      ...homeENG,
    },
  },
});
