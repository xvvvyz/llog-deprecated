const formatDate = (
  input: Date | string,
  options?: Intl.DateTimeFormatOptions,
) =>
  (input instanceof Date ? input : new Date(input)).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'long', weekday: 'long', ...options },
  );

export default formatDate;
