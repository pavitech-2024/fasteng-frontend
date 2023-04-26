import i18next from 'i18next';

// to format date in language
export const formatDate = (date: Date): string => {
  const language = i18next.language === 'ptBR' ? 'pt-BR' : i18next.language || 'pt-br';
  return Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date));
};
