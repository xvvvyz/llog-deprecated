const formatDateTime = (
  input: Date | string,
  options?: Intl.DateTimeFormatOptions,
) =>
  (input instanceof Date ? input : new Date(input)).toLocaleString(undefined, {
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    month: 'numeric',
    ...options,
  });

export default formatDateTime;
