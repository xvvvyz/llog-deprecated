const formatDatetimeLocal = (input?: Date | string) => {
  if (!input) return input;
  const utcDate = input instanceof Date ? input : new Date(input);

  return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19);
};

export default formatDatetimeLocal;
