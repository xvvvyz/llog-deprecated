import { RadioGroup as RG } from '@headlessui/react';
import { HTMLElement } from '@tiptap/core';
import { forwardRef, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface Option {
  label: string;
  value: unknown;
}

interface RadioGroupProps extends HTMLElement {
  name: string;
  onChange: (value: string) => void;
  options: Option[];
  value: string;
}

const RadioGroup = forwardRef(
  (
    { name, onChange, options, value }: RadioGroupProps,
    ref: Ref<HTMLDivElement>
  ) => (
    <RG
      className="input flex p-0 focus-within:ring-0"
      onChange={onChange}
      ref={ref}
      value={value}
    >
      {options.map((option) => (
        <RG.Option
          className="-m-[1px] w-full cursor-pointer rounded text-center focus:outline-none focus:ring-1 focus:ring-accent-2"
          key={option.label}
          value={option.value}
        >
          {({ checked }) => (
            <RG.Description
              className={twMerge(
                'rounded border border-transparent p-2 text-fg-2 transition-[color] hover:text-fg-1',
                checked && 'border-alpha-2 bg-alpha-2 text-fg-1'
              )}
            >
              {option.label}
            </RG.Description>
          )}
        </RG.Option>
      ))}
    </RG>
  )
);

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
