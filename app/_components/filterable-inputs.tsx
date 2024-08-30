'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Input from '@/_components/input';
import InputMenu from '@/_components/input-menu';
import INPUT_TYPE_LABELS from '@/_constants/constant-input-type-labels';
import { ListInputsWithUsesData } from '@/_queries/list-inputs-with-uses';
import getInputUsedBySubjectMap from '@/_utilities/get-input-used-by-subject-map';
import { usePrevious } from '@uidotdev/usehooks';
import Fuse from 'fuse.js';
import * as React from 'react';

interface FilterableInputsProps {
  inputs: NonNullable<ListInputsWithUsesData>;
}

const FilterableInputs = ({ inputs }: FilterableInputsProps) => {
  const [, startTransition] = React.useTransition();
  const ref = React.useRef<HTMLInputElement>(null);

  const [filteredInputs, setFilteredInputs] = React.useState<
    NonNullable<ListInputsWithUsesData>
  >([]);

  const fuse = React.useMemo(
    () =>
      new Fuse(inputs, {
        keys: ['label', 'subjects.name', 'type', 'uses.subject.name'],
        threshold: 0.3,
      }),
    [inputs],
  );

  const filter = React.useCallback(
    (value: string) =>
      setFilteredInputs(fuse.search(value).map((result) => result.item)),
    [fuse],
  );

  const inputsLen = inputs.length;
  const prevInputsLen = usePrevious(inputsLen);

  React.useEffect(() => {
    if (inputsLen !== prevInputsLen) {
      setFilteredInputs(inputs);
      if (ref.current?.value) filter(ref.current.value);
    }
  }, [filter, inputs, inputsLen, prevInputsLen]);

  return (
    <div className="space-y-4">
      <div className="px-4">
        <Input
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) =>
            startTransition(() => {
              if (value) filter(value);
              else setFilteredInputs(inputs);
            })
          }
          placeholder="Filter by label, subject or type…"
          ref={ref}
        />
      </div>
      <ul className="mx-4 overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1 empty:hidden">
        {filteredInputs.map((input) => {
          const usedBy =
            getInputUsedBySubjectMap<NonNullable<ListInputsWithUsesData>[0]>(
              input,
            );

          return (
            <li
              className="flex items-stretch transition-colors hover:bg-alpha-1"
              key={input.id}
            >
              <Button
                className="m-0 w-full min-w-0 gap-6 px-4 py-3 pr-0 leading-snug"
                href={`/inputs/${input.id}`}
                scroll={false}
                variant="link"
              >
                <div className="min-w-0">
                  <div className="truncate">{input.label}</div>
                  <div className="smallcaps flex items-center gap-2 pb-0.5 pt-1.5 text-fg-4">
                    {!!input.subjects.length && (
                      <>
                        <div className="mr-0.5 flex shrink-0 gap-1">
                          {input.subjects.map(({ id, image_uri }) => (
                            <Avatar
                              className="size-4"
                              file={image_uri}
                              key={id}
                              id={id}
                            />
                          ))}
                        </div>
                        &#8226;
                      </>
                    )}
                    <div className="min-w-0">
                      <div className="truncate">
                        {INPUT_TYPE_LABELS[input.type]}
                      </div>
                    </div>
                    &#8226;
                    <div className="min-w-0">
                      <div className="truncate">
                        {usedBy.size ? `Used by ${usedBy.size}` : 'Not used'}
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
              <InputMenu inputId={input.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterableInputs;
