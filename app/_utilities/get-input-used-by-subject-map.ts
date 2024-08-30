const getInputUsedBySubjectMap = <
  T extends { uses: Array<{ subject: { id: string } | null }> },
>(
  input: T,
) =>
  input?.uses?.reduce<Map<string, T['uses'][0]['subject']>>(
    (acc, eventType) => {
      if (!eventType.subject) return acc;
      acc.set(eventType.subject.id, eventType.subject);
      return acc;
    },
    new Map(),
  ) ?? new Map();

export default getInputUsedBySubjectMap;
