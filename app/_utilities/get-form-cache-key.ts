const getFormCacheKey = {
  eventType: ({ id, subjectId }: { id?: string; subjectId: string }) =>
    `subject-${subjectId}-event-type-${id ?? 'create'}`,
  eventTypeTemplate: ({
    id,
    isDuplicate,
  }: { id?: string; isDuplicate?: boolean } = {}) =>
    `event-type-template-${id ?? 'create'}${isDuplicate ? '-duplicate' : ''}`,
  input: ({ id, isDuplicate }: { id?: string; isDuplicate?: boolean } = {}) =>
    `input-${id ?? 'create'}${isDuplicate ? '-duplicate' : ''}`,
  insight: ({ id, subjectId }: { id?: string; subjectId: string }) =>
    `subject-${subjectId}-insight-${id ?? 'create'}`,
  moduleTemplate: ({ id }: { id?: string } = {}) =>
    `module-template-${id ?? 'create'}`,
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
  sessionTemplate: ({
    id,
    isDuplicate,
  }: { id?: string; isDuplicate?: boolean } = {}) =>
    `session-template-${id ?? 'create'}${isDuplicate ? '-duplicate' : ''}`,
};

export default getFormCacheKey;
