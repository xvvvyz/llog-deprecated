'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import TemplateMenu from '@/_components/template-menu';
import TEMPLATE_TYPE_LABELS from '@/_constants/constant-template-type-labels';
import TEMPLATE_TYPE_SLUGS from '@/_constants/constant-template-type-slugs';
import { ListTemplatesData } from '@/_queries/list-templates';
import { usePrevious } from '@uidotdev/usehooks';
import Fuse from 'fuse.js';
import * as React from 'react';

interface FilterableTemplatesProps {
  templates: NonNullable<ListTemplatesData>;
}

const FilterableInputs = ({ templates }: FilterableTemplatesProps) => {
  const [, startTransition] = React.useTransition();
  const ref = React.useRef<HTMLInputElement>(null);

  const [filteredTemplates, setFilteredTemplates] = React.useState<
    NonNullable<ListTemplatesData>
  >([]);

  const fuse = React.useMemo(
    () =>
      new Fuse(templates, {
        keys: ['name', 'type'],
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
          placeholder="Filter by name or type…"
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
              href={`/templates/${TEMPLATE_TYPE_SLUGS[template.type]}/${template.id}`}
              scroll={false}
              variant="link"
            >
              <div className="min-w-0">
                <div className="truncate">{template.name}</div>
                <div className="smallcaps pb-0.5 pt-1 text-fg-4">
                  {TEMPLATE_TYPE_LABELS[template.type]}
                </div>
              </div>
            </Button>
            <TemplateMenu templateId={template.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterableInputs;
