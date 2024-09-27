'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import Switch from '@/_components/switch';
import Tip from '@/_components/tip';
import createShareCode from '@/_mutations/create-share-code';
import updateSubject from '@/_mutations/update-subject';
import { GetSubjectData } from '@/_queries/get-subject';
import { ListSubjectsData } from '@/_queries/list-subjects';
import ArchiveBoxIcon from '@heroicons/react/24/outline/ArchiveBoxIcon';
import ArchiveBoxXMarkIcon from '@heroicons/react/24/outline/ArchiveBoxXMarkIcon';
import ArrowDownTrayIcon from '@heroicons/react/24/outline/ArrowDownTrayIcon';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import ChartBarSquareIcon from '@heroicons/react/24/outline/ChartBarSquareIcon';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import ShareIcon from '@heroicons/react/24/outline/ShareIcon';
import { useCopyToClipboard, useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useOptimistic, useRef, useTransition } from 'react';
import { twMerge } from 'tailwind-merge';

interface SubjectMenuProps {
  canUnarchive?: boolean;
  isList?: boolean;
  subject: NonNullable<GetSubjectData> | NonNullable<ListSubjectsData>[0];
}

const SubjectMenu = ({ canUnarchive, isList, subject }: SubjectMenuProps) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [, startPublicTransition] = useTransition();
  const [hasCopiedClientLink, toggleHasCopiedClientLink] = useToggle(false);
  const [hasCopiedPublicLink, toggleHasCopiedPublicLink] = useToggle(false);
  const [isArchiveTransitioning, startIsArchiveTransition] = useTransition();
  const [isDownloadTransitioning, startIsDownloadTransition] = useTransition();
  const [isGenerateTransitioning, startGenerateTransition] = useTransition();
  const [opPublic, toggleOpPublic] = useOptimistic(subject.public, (s) => !s);
  const clientLinkTimeoutRef = useRef<NodeJS.Timeout>();
  const publicLinkTimeoutRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        {isList ? (
          <Button
            className="group m-0 justify-center px-2 py-0 text-fg-3 hover:text-fg-2"
            variant="link"
          >
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </Button>
        ) : (
          <Button className="pr-4.5" colorScheme="transparent" size="sm">
            <Bars3Icon className="-ml-1 w-5 text-fg-4" />
            More
          </Button>
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Subject menu</Drawer.Title>
          <Drawer.Description />
          {isList && (
            <>
              <Drawer.Button
                className="w-full"
                href={`/subjects/${subject.id}/edit`}
              >
                <PencilIcon className="w-5 text-fg-4" />
                Edit
              </Drawer.Button>
              <Drawer.Separator />
            </>
          )}
          <Drawer.Button
            className={twMerge(!isList && 'sm:hidden')}
            href={`/subjects/${subject.id}/insights`}
          >
            <ChartBarSquareIcon className="w-5 text-fg-4" />
            Insights
          </Drawer.Button>
          <div className="relative">
            <Drawer.Button
              className="w-full"
              href={`/subjects/${subject.id}/notes`}
            >
              <PencilSquareIcon className="w-5 text-fg-4" />
              Notes
            </Drawer.Button>
            <Tip align="end" className="absolute right-3 top-2.5">
              Not visible to clients.
            </Tip>
          </div>
          <Drawer.Separator />
          <div className="relative">
            <Drawer.Button
              className="w-full"
              loading={isGenerateTransitioning}
              loadingText="Generating link…"
              onClick={(e) =>
                startGenerateTransition(async () => {
                  e.preventDefault();
                  clearTimeout(clientLinkTimeoutRef.current);
                  let shareCode = subject.share_code;

                  if (!shareCode) {
                    const { data } = await createShareCode(subject.id);
                    shareCode = data?.share_code as string;
                  }

                  await copyToClipboard(
                    `${location.origin}/subjects/${subject.id}/join/${shareCode}`,
                  );

                  toggleHasCopiedClientLink(true);

                  clientLinkTimeoutRef.current = setTimeout(
                    () => toggleHasCopiedClientLink(false),
                    2000,
                  );
                })
              }
            >
              {hasCopiedClientLink ? (
                <>
                  <CheckIcon className="w-5 text-fg-4" />
                  Copied, share it!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-5 text-fg-4" />
                  Copy client link
                </>
              )}
            </Drawer.Button>
            <Tip align="end" className="absolute right-3 top-2.5">
              Clients can complete protocols, record events and&nbsp;comment.
            </Tip>
          </div>
          <Drawer.NestedRoot>
            <Drawer.Trigger asChild>
              <Drawer.Button>
                <ShareIcon className="w-5 text-fg-4" />
                Share profile
              </Drawer.Button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay />
              <Drawer.Content>
                <Drawer.Title>Share</Drawer.Title>
                <Drawer.Description />
                {opPublic && (
                  <>
                    <Drawer.Button
                      href={`/share/${subject.id}`}
                      target="_blank"
                    >
                      <ArrowTopRightOnSquareIcon className="w-5 text-fg-4" />
                      View public profile
                    </Drawer.Button>
                    <Drawer.Button
                      className="mb-8"
                      onClick={async () => {
                        clearTimeout(publicLinkTimeoutRef.current);

                        void copyToClipboard(
                          `${location.origin}/share/${subject.id}`,
                        );

                        publicLinkTimeoutRef.current = setTimeout(
                          () => toggleHasCopiedPublicLink(false),
                          2000,
                        );

                        toggleHasCopiedPublicLink(true);
                      }}
                    >
                      {hasCopiedPublicLink ? (
                        <>
                          <CheckIcon className="w-5 text-fg-4" />
                          Copied, share it!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-5 text-fg-4" />
                          Copy share link
                        </>
                      )}
                    </Drawer.Button>
                  </>
                )}
                <Switch
                  checked={opPublic}
                  description={
                    <>
                      Anyone with the link can access.
                      <br />
                      Clients are anonymized.
                    </>
                  }
                  label="Public read-only profile"
                  name="share"
                  onCheckedChange={() =>
                    startPublicTransition(() => {
                      toggleOpPublic(null);

                      void updateSubject({
                        id: subject.id,
                        public: !opPublic,
                      });
                    })
                  }
                />
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.NestedRoot>
          <Drawer.Separator />
          <Drawer.Button
            loading={isDownloadTransitioning}
            loadingText="Exporting…"
            onClick={(e) =>
              startIsDownloadTransition(async () => {
                e.preventDefault();
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

                const r = await fetch(
                  `/subjects/${subject.id}/events.csv?tz=${tz}`,
                );

                const blob = await r.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'events.csv';
                a.click();
              })
            }
          >
            <ArrowDownTrayIcon className="w-5 text-fg-4" />
            Export events
          </Drawer.Button>
          <Drawer.Separator />
          <Drawer.Button
            href={!subject.archived || canUnarchive ? undefined : '/upgrade'}
            loading={isArchiveTransitioning}
            loadingText={subject.archived ? 'Unarchiving…' : 'Archiving…'}
            onClick={
              !subject.archived || canUnarchive
                ? (e) =>
                    startIsArchiveTransition(async () => {
                      e.preventDefault();

                      await updateSubject({
                        archived: !subject.archived,
                        id: subject.id,
                      });
                    })
                : undefined
            }
          >
            {subject.archived ? (
              <ArchiveBoxXMarkIcon className="w-5 text-fg-4" />
            ) : (
              <ArchiveBoxIcon className="w-5 text-fg-4" />
            )}
            {subject.archived ? 'Unarchive' : 'Archive'}
          </Drawer.Button>
          <DrawerDeleteButton
            confirmText="Delete subject"
            onConfirm={async () => {
              await updateSubject({ deleted: true, id: subject.id });
              if (!isList) router.replace('/subjects');
            }}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default SubjectMenu;
