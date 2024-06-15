import strip from '@/_utilities/strip';

const formatDirtyColumnHeader = (header: string) => {
  const stripped = strip(header);
  if (!stripped) return '';
  return `“${stripped}”`;
};

export default formatDirtyColumnHeader;
