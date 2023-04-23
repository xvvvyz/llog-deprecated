const formatDatetimeLocal = (
  input?: Date | string,
  { seconds }: { seconds: boolean } = { seconds: true }
) => {
  if (!input) return input;
  const utcDate = input instanceof Date ? input : new Date(input);

  return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, seconds ? 19 : 16);
};

export default formatDatetimeLocal;
