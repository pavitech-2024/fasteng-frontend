export const validateName = (name: string) => {
  const regex = /^[A-Za-z\s]{3,50}$/;
  return regex.test(name);
};
