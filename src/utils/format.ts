// to format date in pt-BR
export const formatDate = (date: Date): string =>
  Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date));
