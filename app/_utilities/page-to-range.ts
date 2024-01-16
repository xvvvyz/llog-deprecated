import MAX_PAGE_SIZE from '@/_constants/max-page-size';

const pageToRange = ({ page = 0, size = MAX_PAGE_SIZE }) => {
  const from = page * size;
  const to = from + size - 1;
  return [from, to];
};

export default pageToRange;
