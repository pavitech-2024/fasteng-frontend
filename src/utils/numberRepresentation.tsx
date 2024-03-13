export const numberRepresentation = (value: string | number, digits = 2): string => {
  const aux: number = typeof value === 'number' ? value : convertNumber(value);
  if (validateNumber(aux)) {
    const formato = { minimumFractionDigits: digits, maximumFractionDigits: digits }
    return aux.toLocaleString('pt-BR', formato);
  } else {
    return "";
  }
};


export const convertSendNumber = (value) => {
  let aux = convertNumber(value);
  if (!validateNumber(aux)) {
    aux = 0;
  }
  return aux;
};

export const convertNumber = (value) => {
  let aux = value;
  if (typeof aux !== 'number' && aux !== null && aux !== undefined && aux.includes(",")) {
    aux = aux.replace(".", "").replace(",", ".");
  }
  return parseFloat(aux);
};

export const validateNumber = (value) => {
  const auxValue = convertNumber(value);
  return !isNaN(auxValue) && typeof auxValue === 'number';
};

export const identifyNotationViscosity = (type) => {
  return type === 'Rotacional' ? '(cP)' : '(SSF)';
};
