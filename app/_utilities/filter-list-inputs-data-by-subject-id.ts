import { ListInputsData } from '@/_server/list-inputs';
import forceArray from '@/_utilities/force-array';

const filterListInputsDataBySubjectId = (
  inputs: ListInputsData,
  subjectId: string,
) =>
  forceArray(inputs).filter(({ subjects }) => {
    const s = forceArray(subjects);
    return !s.length || s.some(({ id }) => id === subjectId);
  }) as NonNullable<ListInputsData>;

export default filterListInputsDataBySubjectId;
