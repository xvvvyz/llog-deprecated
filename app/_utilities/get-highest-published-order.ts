const getHighestPublishedOrder = (
  sessions: Array<{ draft: boolean; order: number }>,
) =>
  sessions.reduce(
    (acc, session) => (session.draft ? acc : Math.max(acc, session.order)),
    -1,
  );

export default getHighestPublishedOrder;
