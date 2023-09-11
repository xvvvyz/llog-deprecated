'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Input from '@/_components/input';
import INPUT_LABELS from '@/_constants/constant-input-labels';
import { ListInputsData } from '@/_server/list-inputs';
import forceArray from '@/_utilities/force-array';
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
} from 'react';

interface FilterableInputLinkListProps {
  inputs: NonNullable<ListInputsData>;
}

const FilterableInputLinkList = ({ inputs }: FilterableInputLinkListProps) => {
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
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            if (value) filter(value);
            else setFilteredInputs(inputs);

            requestAnimationFrame(() => {
              // stupid fucking bullshit
              if (ref.current) ref.current.focus();
            });
          }}
          placeholder="Filter by label, subject or type…"
          ref={ref}
        />
      </div>
      <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1 empty:hidden">
        {filteredInputs.map((input) => {
          const avatars = forceArray(input.subjects);

          return (
            <li className="flex items-stretch hover:bg-alpha-1" key={input.id}>
              <Button
                className="m-0 w-full gap-6 px-4 py-3 pr-0 leading-snug"
                href={`/inputs/${input.id}`}
                variant="link"
              >
                <div>
                  {input.label}
                  <div className="smallcaps pb-0.5 pt-1">
                    {INPUT_LABELS[input.type]}
                  </div>
                </div>
                {!!avatars.length && (
                  <div className="-my-0.5 ml-auto flex shrink-0 gap-1.5">
                    {avatars.map(({ id, image_uri, name }) => (
                      <Avatar file={image_uri} key={id} name={name} size="xs" />
                    ))}
                  </div>
                )}
              </Button>
              <InputListItemMenu inputId={input.id} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterableInputLinkList;
