import forceArray from '@/_utilities/force-array';

const formatTitle = (parts: string | (string | null | undefined)[]) =>
  forceArray(parts)
    .filter((p) => p)
    .join(' / ');

export default formatTitle;
