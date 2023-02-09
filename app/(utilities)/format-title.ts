import forceArray from './force-array';

const formatTitle = (parts: string | (string | null | undefined)[]) =>
  forceArray(parts)
    .filter((p) => p)
    .join(' / ');

export default formatTitle;
