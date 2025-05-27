import i18next from 'i18next';

// to format date in language
/*export const formatDate = (date: Date): string => {
  //const language = i18next.language === 'ptbr' ? 'pt-BR' : i18next.language || 'pt-br';
  //const teste = Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' })?.format(new Date(date));
  //return Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' })?.format(new Date(date)); //;
  //console.log("Console log do teste", teste);
  //return "new Date";
};*/

export const formatDate = (date: Date | string | number): string => {
  const language =  i18next.language === 'en' ? 'en-US' : 'pt-BR';  // Formato brasileiro ou americano, a depender do idioma escolhido pelo usuário
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return ""; // Retorna vazio se a data for inválida
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: 'long' 
  }).format(parsedDate);
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
