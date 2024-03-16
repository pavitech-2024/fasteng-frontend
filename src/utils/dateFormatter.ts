export const dateFormatter = (input) => {
  if (input === null) {
    return input;
  } else {
    // Remove qualquer caractere não numérico
    const numericInput = input.replace(/\D/g, '');

    // Adiciona as barras nos lugares certos
    if (numericInput.length <= 2) {
      return numericInput;
    } else if (numericInput.length <= 4) {
      return `${numericInput.slice(0, 2)}/${numericInput.slice(2)}`;
    } else {
      return `${numericInput.slice(0, 2)}/${numericInput.slice(2, 4)}/${numericInput.slice(4, 8)}`;
    }
  }
};
