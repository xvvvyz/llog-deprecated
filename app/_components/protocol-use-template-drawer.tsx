'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import Select, { IOption } from '@/_components/select';
import createProtocolFromTemplate from '@/_mutations/create-protocol-from-template';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface ProtocolUseTemplateDrawerProps {
  availableProtocolTemplates: NonNullable<ListTemplatesBySubjectIdAndTypeData>;
  subjectId: string;
}

const ProtocolUseTemplateDrawer = ({
  availableProtocolTemplates,
  subjectId,
}: ProtocolUseTemplateDrawerProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button className="pr-2 sm:pr-6" variant="link">
          <DocumentTextIcon className="w-5 text-fg-4" />
          Use template
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title className="not-sr-only text-center text-2xl">
            Use template
          </Drawer.Title>
          <Drawer.Description className="mt-4 px-4 text-center text-fg-4">
            It&rsquo;s easier than typing.
          </Drawer.Description>
          <div className="pt-16 text-left">
            <Select
              isLoading={isTransitioning}
              noOptionsMessage={() => 'No templates.'}
              onChange={(t) =>
                startTransition(async () => {
                  const template = t as NonNullable<ListTemplatesData>[0];

                  const res = await createProtocolFromTemplate({
                    subjectId,
                    templateId: template.id,
                  });

                  if (res.error) {
                    alert(res.error);
                    return;
                  }

                  router.replace(
                    `/subjects/${subjectId}/protocols/${res.data?.id}/sessions`,
                  );
                })
              }
              options={availableProtocolTemplates as IOption[]}
              placeholder="Select a template…"
              value={null}
            />
          </div>
          <Drawer.Close asChild>
            <Button
              className="-mb-3 mt-14 w-full justify-center p-0 py-3"
              variant="link"
            >
              Close
            </Button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ProtocolUseTemplateDrawer;
