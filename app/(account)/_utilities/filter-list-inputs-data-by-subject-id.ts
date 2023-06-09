import { ListInputsData } from '@/(account)/_server/list-inputs';
import { Database } from '@/_types/database';
import forceArray from './force-array';

const filterListInputsDataBySubjectId = (
  inputs: ListInputsData,
  subjectId: string
): ListInputsData =>
  forceArray(inputs).filter(
    ({ subjects }) =>
      !subjects ||
      !subjects.length ||
      (subjects as Database['public']['Tables']['subjects']['Row'][]).some(
        ({ id }) => id === subjectId
      )
  ) as ListInputsData;

export default filterListInputsDataBySubjectId;
