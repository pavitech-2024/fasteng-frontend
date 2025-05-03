export const phoneMask = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  const limiteDigits = digits.slice(0, 11);

  if (limiteDigits.length === 11) {
    return limiteDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (limiteDigits.length === 10) {
    return limiteDigits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return limiteDigits;
};
