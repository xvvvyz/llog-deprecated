const formatDateTime = (input: Date | string) =>
  (input instanceof Date ? input : new Date(input)).toLocaleString(undefined, {
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    month: 'numeric',
    year: '2-digit',
  });

export default formatDateTime;
