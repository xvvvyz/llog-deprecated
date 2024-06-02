import { ListEventsData } from '@/_queries/list-events';

const formatFullName = (u: NonNullable<ListEventsData>[0]['profile']) =>
  `${u?.first_name} ${u?.last_name}`;

export default formatFullName;
