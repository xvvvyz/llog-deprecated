import Button from '@/_components/button';
import ProtocolMenu from '@/_components/protocol-menu';
import { ListProtocolsData } from '@/_queries/list-protocols';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProtocolsProps {
  isTeamMember: boolean;
  protocols: NonNullable<ListProtocolsData>;
  subjectId: string;
}

const Protocols = async ({
  isTeamMember,
  protocols,
  subjectId,
}: ProtocolsProps) => {
  const listItems = protocols.reduce((acc, protocol) => {
    const activeSession = protocol.sessions.find(({ modules }) =>
      modules.find((et) => !et.event.length),
    );

    if (!isTeamMember && !activeSession) return acc;
    const activeSessionId = activeSession?.id || '';

    acc.push(
      <li
        className="flex items-stretch transition-colors hover:bg-alpha-1"
        key={protocol.id}
      >
        <Button
          className={twMerge(
            'm-0 w-full min-w-0 gap-4 px-4 py-3 leading-snug',
            isTeamMember && 'pr-0',
          )}
          href={
            isTeamMember
              ? `/subjects/${subjectId}/protocols/${protocol.id}/sessions`
              : `/subjects/${subjectId}/protocols/${protocol.id}/sessions/${activeSessionId}`
          }
          variant="link"
        >
          <div className="w-full min-w-0">
            <div className="flex w-full justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate">{protocol.name}</div>
              </div>
              {!isTeamMember && <ArrowUpRightIcon className="w-5 shrink-0" />}
            </div>
            {!isTeamMember && activeSession && (
              <div className="truncate text-fg-4">
                Session {activeSession.order + 1}
                {activeSession.title ? `: ${activeSession.title}` : ''}
              </div>
            )}
          </div>
        </Button>
        {isTeamMember && (
          <ProtocolMenu subjectId={subjectId} protocolId={protocol.id} />
        )}
      </li>,
    );

    return acc;
  }, [] as ReactElement[]);

  if (!listItems.length) return null;

  return (
    <ul className="m-0 overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1">
      {listItems}
    </ul>
  );
};

export default Protocols;
