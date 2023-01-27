const formatTime = (input: Date | string) =>
  (input instanceof Date ? input : new Date(input))
    .toLocaleTimeString(undefined, { timeStyle: 'short' })
    .replace(/\s/, '')
    .toLowerCase();

export default formatTime;
