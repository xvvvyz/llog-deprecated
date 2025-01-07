'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Empty from '@/_components/empty';
import Input from '@/_components/input';
import TemplateMenu from '@/_components/template-menu';
import TEMPLATE_TYPE_LABELS from '@/_constants/constant-template-type-labels';
import TEMPLATE_TYPE_SLUGS from '@/_constants/constant-template-type-slugs';
import { ListCommunityTemplatesData } from '@/_queries/list-community-templates';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { usePrevious } from '@uidotdev/usehooks';
import Fuse from 'fuse.js';
import * as React from 'react';

interface FilterableCommunityTemplatesProps {
  templates: NonNullable<ListCommunityTemplatesData>;
}

const FilterableCommunityTemplates = ({
  templates,
}: FilterableCommunityTemplatesProps) => {
  const [, startTransition] = React.useTransition();
  const ref = React.useRef<HTMLInputElement>(null);

  const [filteredTemplates, setFilteredTemplates] = React.useState<
    NonNullable<ListCommunityTemplatesData>
  >([]);

  const fuse = React.useMemo(
    () =>
      new Fuse(templates, {
        keys: ['author.first_name', 'author.last_name', 'name', 'type'],
        threshold: 0.3,
      }),
    [templates],
  );

  const filter = React.useCallback(
    (value: string) =>
      setFilteredTemplates(fuse.search(value).map((result) => result.item)),
    [fuse],
  );

  const templatesLen = templates.length;
  const prevTemplatesLen = usePrevious(templatesLen);

  React.useEffect(() => {
    if (templatesLen !== prevTemplatesLen) {
      setFilteredTemplates(templates);
      if (ref.current?.value) filter(ref.current.value);
    }
  }, [filter, templates, templatesLen, prevTemplatesLen]);

  if (!templates?.length) {
    return (
      <Empty className="mx-4">
        <InformationCircleIcon className="w-7" />
        No community templates.
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <Input
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) =>
            startTransition(() => {
              if (value) filter(value);
              else setFilteredTemplates(templates);
            })
          }
          placeholder="Filter by name, type or author…"
          ref={ref}
        />
      </div>
      <ul className="mx-4 overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1 empty:hidden">
        {filteredTemplates.map((template) => (
          <li
            className="flex items-stretch transition-colors hover:bg-alpha-1"
            key={template.id}
          >
            <Button
              className="m-0 w-full min-w-0 gap-6 px-4 py-3 pr-0 leading-snug"
              href={`/community/templates/${TEMPLATE_TYPE_SLUGS[template.type]}/${template.id}`}
              variant="link"
            >
              <div className="min-w-0">
                <div className="truncate">{template.name}</div>
                <div className="smallcaps flex items-center gap-2 pb-0.5 pt-1.5 text-fg-4">
                  <div className="shrink-0">
                    {TEMPLATE_TYPE_LABELS[template.type]}
                  </div>
                  &#8226;
                  <div className="ml-0.5 flex min-w-0 gap-2">
                    <div className="shrink-0">By</div>
                    <Avatar
                      className="size-4 shrink-0"
                      file={template.author.image_uri}
                      id={template.author.id}
                    />
                    <div className="min-w-0">
                      <div className="truncate">
                        {`${template.author.first_name} ${template.author.last_name}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Button>
            <TemplateMenu templateId={template.id} type={template.type} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterableCommunityTemplates;
