import forceArray from './force-array';

const formatTitle = (parts: string | string[]) =>
  forceArray(parts).join(' / ') + ' - llog';

export default formatTitle;
