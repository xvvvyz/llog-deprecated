import strip from '@/_utilities/strip';

const formatDirtyColumnHeader = (header: string) => `“${strip(header)}”`;

export default formatDirtyColumnHeader;
