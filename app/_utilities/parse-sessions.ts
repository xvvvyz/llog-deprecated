const parseSessions = <
  T extends Array<{ draft: boolean; id: string; order: number }>,
>({
  currentSession,
  sessionOrder,
  sessions,
}: {
  currentSession?: { id: string };
  sessionOrder?: number;
  sessions: T;
}) =>
  sessions.reduce<{
    highestOrder: number;
    highestPublishedOrder: number;
    nextSessionId: string | null;
    previousSessionId: string | null;
    sessionsReversed: T;
  }>(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session?.order ?? 0);

      acc.highestPublishedOrder = session?.draft
        ? acc.highestPublishedOrder
        : Math.max(acc.highestPublishedOrder, session?.order ?? 0);

      acc.sessionsReversed.push(sessions[sessions.length - i - 1]);

      if (currentSession) {
        if (currentSession.id === session.id) {
          acc.nextSessionId = sessions[i + 1]?.id;
          acc.previousSessionId = sessions[i - 1]?.id;
        }
      } else {
        if (session.order === sessionOrder) {
          acc.nextSessionId = sessions[i + 1]?.id;
          acc.previousSessionId = sessions[i]?.id;
        }
      }

      return acc;
    },
    {
      highestOrder: -1,
      highestPublishedOrder: -1,
      nextSessionId: null,
      previousSessionId: null,
      sessionsReversed: [] as unknown as T,
    },
  );

export default parseSessions;
