'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Input from '@/_components/input';
import INPUT_LABELS from '@/_constants/constant-input-labels';
import { ListInputsData } from '@/_queries/list-inputs';
import { usePrevious } from '@uidotdev/usehooks';
import Fuse from 'fuse.js';
import InputListItemMenu from './input-list-item-menu';

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

interface FilterableInputLinkListProps {
  inputs: NonNullable<ListInputsData>;
}

const FilterableInputLinkList = ({ inputs }: FilterableInputLinkListProps) => {
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLInputElement>(null);

  const [filteredInputs, setFilteredInputs] = useState<
    NonNullable<ListInputsData>
  >([]);

  const fuse = useMemo(
    () =>
      new Fuse(inputs, {
        keys: ['label', 'subjects.name', 'type'],
        threshold: 0.3,
      }),
    [inputs],
  );

  const filter = useCallback(
    (value: string) =>
      setFilteredInputs(fuse.search(value).map((result) => result.item)),
    [fuse],
  );

  const inputsLen = inputs.length;
  const prevInputsLen = usePrevious(inputsLen);

  useEffect(() => {
    if (inputsLen !== prevInputsLen) {
      setFilteredInputs(inputs);
      if (ref.current?.value) filter(ref.current.value);
    }
  }, [filter, inputs, inputsLen, prevInputsLen]);

  return (
    <div className="space-y-4">
      <div className="px-4">
        <Input
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
            startTransition(() => {
              if (value) filter(value);
              else setFilteredInputs(inputs);
            })
          }
          placeholder="Filter by label, subject or type…"
          ref={ref}
        />
      </div>
      <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1 empty:hidden">
        {filteredInputs.map((input) => (
          <li className="flex items-stretch hover:bg-alpha-1" key={input.id}>
            <Button
              className="m-0 w-full gap-6 px-4 py-3 pr-0 leading-snug"
              href={`/inputs/${input.id}`}
              scroll={false}
              variant="link"
            >
              <div>
                {input.label}
                <div className="smallcaps pb-0.5 pt-1 text-fg-4">
                  {INPUT_LABELS[input.type]}
                </div>
              </div>
              {!!input.subjects.length && (
                <div className="-my-0.5 ml-auto flex shrink-0 gap-1.5">
                  {input.subjects.map(({ id, image_uri }) => (
                    <Avatar file={image_uri} key={id} id={id} size="xs" />
                  ))}
                </div>
              )}
            </Button>
            <InputListItemMenu inputId={input.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterableInputLinkList;
