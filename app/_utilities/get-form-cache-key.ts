const getFormCacheKey = {
  eventType: ({ id, subjectId }: { id?: string; subjectId: string }) =>
    `subject-${subjectId}-event-type-${id ?? 'create'}`,
  input: ({ id, isDuplicate }: { id?: string; isDuplicate?: boolean } = {}) =>
    `input-${id ?? 'create'}${isDuplicate ? '-duplicate' : ''}`,
  session: ({
    id,
    isDuplicate,
    missionId,
    subjectId,
  }: {
    id?: string;
    isDuplicate?: boolean;
    missionId: string;
    subjectId: string;
  }) =>
    `subject-${subjectId}-mission-${missionId}-session-${id ?? 'create'}${isDuplicate ? '-duplicate' : ''}`,
  template: ({
    id,
    isDuplicate,
  }: { id?: string; isDuplicate?: boolean } = {}) =>
    `template-${id ?? 'create'}${isDuplicate ? '-duplicate' : ''}`,
};

export default getFormCacheKey;
