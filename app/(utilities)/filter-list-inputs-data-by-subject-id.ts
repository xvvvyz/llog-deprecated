import { Database } from '(types)/database';
import forceArray from './force-array';
import { ListInputsData } from './list-inputs';

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
