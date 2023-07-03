import i18next from 'i18next';

// to format date in language
export const formatDate = (date: Date): string => {
  const language = i18next.language === 'ptbr' ? 'pt-BR' : i18next.language || 'pt-br';
  return Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(date)); //;
};

// to convert file to base64
export const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (err) => {
      reject(err);
    };
  });
};
