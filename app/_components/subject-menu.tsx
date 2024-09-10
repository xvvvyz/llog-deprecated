'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
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
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import ShareIcon from '@heroicons/react/24/outline/ShareIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {isList ? (
          <div className="group flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2">
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-sm border border-alpha-3 pr-4 transition-colors hover:bg-alpha-1">
            <Avatar
              className="-m-px size-[calc(theme('spacing.8')+2px)]"
              file={subject.image_uri}
              id={subject.id}
            />
            <div className="min-w-0 pl-1">
              <div className="truncate">{subject.name}</div>
            </div>
            <ChevronDownIcon className="w-5 shrink-0" />
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={isList ? 'end' : 'start'}
          className={twMerge(isList && 'mr-1.5')}
        >
          <DropdownMenu.Button
            href={`/subjects/${subject.id}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit profile
          </DropdownMenu.Button>
          <div className="relative">
            <DropdownMenu.Button
              href={`/subjects/${subject.id}/notes`}
              scroll={false}
            >
              <PencilSquareIcon className="w-5 text-fg-4" />
              Notes
            </DropdownMenu.Button>
            <Tip
              align="end"
              className="absolute right-4 top-2.5"
              tipClassName="mr-0.5"
            >
              Not visible to clients.
            </Tip>
          </div>
          <DropdownMenu.Separator />
          <div className="relative">
            <DropdownMenu.Button
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
            </DropdownMenu.Button>
            <Tip
              align="end"
              className="absolute right-4 top-2.5"
              tipClassName="mr-0.5"
            >
              Clients can complete training plans, record events
              and&nbsp;comment.
            </Tip>
          </div>
          <Modal.Root>
            <Modal.Trigger asChild>
              <DropdownMenu.Button>
                <ShareIcon className="w-5 text-fg-4" />
                Share profile
              </DropdownMenu.Button>
            </Modal.Trigger>
            <Modal.Portal>
              <Modal.Overlay>
                <Modal.Content className="max-w-sm p-8 pt-5">
                  <div className="flex items-center justify-between">
                    <Modal.Title className="text-2xl">Share</Modal.Title>
                    <Modal.Close asChild>
                      <IconButton
                        icon={
                          <XMarkIcon className="relative -right-[0.16em] w-7" />
                        }
                      />
                    </Modal.Close>
                  </div>
                  <div className="pt-8">
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
                  </div>
                  {opPublic && (
                    <div className="mt-10 space-y-4">
                      <Button
                        className="w-full justify-between"
                        colorScheme="transparent"
                        href={`/share/${subject.id}`}
                        target="_blank"
                      >
                        View public profile
                        <ArrowTopRightOnSquareIcon className="w-5" />
                      </Button>
                      <Button
                        className="w-full justify-between"
                        colorScheme="transparent"
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
                            Copied, share it!
                            <CheckIcon className="w-5" />
                          </>
                        ) : (
                          <>
                            Copy share link
                            <ClipboardDocumentIcon className="w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Modal.Content>
              </Modal.Overlay>
            </Modal.Portal>
          </Modal.Root>
          <DropdownMenu.Separator />
          <DropdownMenu.Button
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
          </DropdownMenu.Button>
          <DropdownMenu.Separator />
          <DropdownMenu.Button
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
          </DropdownMenu.Button>
          <DropdownMenuDeleteItem
            confirmText="Delete subject"
            onConfirm={async () => {
              await updateSubject({ deleted: true, id: subject.id });
              if (!isList) router.replace('/subjects');
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SubjectMenu;
