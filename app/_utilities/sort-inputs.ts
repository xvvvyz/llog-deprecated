import { ListInputsData } from '@/_queries/list-inputs';

const sortInputs = (
  a: NonNullable<ListInputsData>[0],
  b: NonNullable<ListInputsData>[0],
) => {
  const aSubjectName =
    Array.isArray(a.subjects) && a.subjects.length ? a.subjects[0].name : '';

  const bSubjectName =
    Array.isArray(b.subjects) && b.subjects.length ? b.subjects[0].name : '';

  return aSubjectName.localeCompare(bSubjectName);
};

export default sortInputs;
