import add24Hours from '@/_utilities/add-24-hours';
import parseShortIso from '@/_utilities/parse-short-iso';

const formatEventFilters = ({
  from,
  limit,
  to,
}: {
  from?: string;
  limit?: string;
  to?: string;
}) => ({
  endDate: add24Hours(parseShortIso(to ?? from)),
  from: 0,
  pageSize: 25,
  startDate: parseShortIso(from),
  to: limit ? Number(limit) : 24,
});

export default formatEventFilters;
