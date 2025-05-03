export const validatePhone = (phone: string) => {
  const regex = /^\d{10,11}$/;
  return regex.test(phone);
};
