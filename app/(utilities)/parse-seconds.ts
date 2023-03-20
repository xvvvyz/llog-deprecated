const parseSeconds = (s: string | number) => {
  let totalSeconds = Number(s);
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds];
};

export default parseSeconds;
