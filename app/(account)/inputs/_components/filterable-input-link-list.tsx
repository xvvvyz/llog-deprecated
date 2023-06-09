'use client';

import LinkList from '@/(account)/_components/link-list';
import INPUT_LABELS from '@/(account)/_constants/constant-input-labels';
import usePrevious from '@/(account)/_hooks/use-previous';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import forceArray from '@/(account)/_utilities/force-array';
import Input from '@/_components/input';
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
    [inputs]
  );

  const filter = useCallback(
    (value: string) =>
      setFilteredInputs(fuse.search(value).map((result) => result.item)),
    [fuse]
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
      <LinkList>
        {filteredInputs.map((input) => (
          <LinkList.Item
            avatars={forceArray(input.subjects)}
            href={`/inputs/${input.id}`}
            icon="edit"
            key={input.id}
            menu={<InputListItemMenu inputId={input.id} />}
            pill={INPUT_LABELS[input.type]}
            text={input.label}
          />
        ))}
      </LinkList>
    </div>
  );
};

export default FilterableInputLinkList;
