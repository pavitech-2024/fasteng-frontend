export const nameMask = (value: string) => {
  return value.replace(/[^a-zA-Z ]/g, '');
};