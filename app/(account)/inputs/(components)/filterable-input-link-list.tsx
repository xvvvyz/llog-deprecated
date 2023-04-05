'use client';

import Input from '(components)/input';
import LinkList from '(components)/link-list';
import INPUT_LABELS from '(utilities)/constant-input-labels';
import forceArray from '(utilities)/force-array';
import { ListInputsData } from '(utilities)/list-inputs';
import Fuse from 'fuse.js';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import InputListItemMenu from './input-list-item-menu';

interface FilterableInputLinkListProps {
  inputs: NonNullable<ListInputsData>;
}

const FilterableInputLinkList = ({ inputs }: FilterableInputLinkListProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [filteredInputs, setFilteredInputs] = useState(inputs);

  const fuse = useMemo(
    () =>
      new Fuse(inputs, {
        keys: ['label', 'subjects.name', 'type'],
        threshold: 0.3,
      }),
    [inputs]
  );

  return (
    <div className="space-y-4">
      <Input
        onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
          setFilteredInputs(
            value ? fuse.search(value).map((result) => result.item) : inputs
          );

          requestAnimationFrame(() => {
            // stupid fucking bullshit
            if (ref.current) ref.current.focus();
          });
        }}
        placeholder="Filter by label, subject or type…"
        ref={ref}
      />
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
