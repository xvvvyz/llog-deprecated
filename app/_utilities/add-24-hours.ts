const add24Hours = <T extends string>(date?: T) => {
  if (!date) return date;
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate.toISOString() as T;
};

export default add24Hours;
