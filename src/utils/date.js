export const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

export const now = () => new Date();
