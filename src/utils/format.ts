import i18next from 'i18next';

// to format date in language
/*export const formatDate = (date: Date): string => {
  const language = i18next.language === 'ptbr' ? 'pt-BR' : i18next.language || 'pt-br';
  //const teste = Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' })?.format(new Date(date));
  //return Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' })?.format(new Date(date)); //;
  //console.log("Console log do teste", teste);
  return "new Date";
};*/


export const formatDate = (date: Date | string | undefined): string => {
  // Se for undefined, null ou string vazia
  if (!date) return null;
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Se for uma data inválida
    if (isNaN(dateObj.getTime())) return null;
    
    const language = i18next.language === 'ptbr' ? 'pt-BR' : i18next.language || 'pt-BR';
    
    return new Intl.DateTimeFormat(language, { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
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
