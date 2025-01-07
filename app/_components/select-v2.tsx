'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as ToggleGroup from '@/_components/toggle-group';
import ChevronUpDownIcon from '@heroicons/react/24/outline/ChevronUpDownIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { usePrevious } from '@uidotdev/usehooks';
import Fuse from 'fuse.js';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const SelectCreateOptionInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    inputClassName?: string;
    onCreateOption?: (value: string) => Promise<void>;
    optionName: string;
  }
>(({ className, inputClassName, onCreateOption, optionName, ...rest }, ref) => {
  const [isTransitioning, startTransition] = React.useTransition();

  const onCreate = () =>
    startTransition(async () => {
      if (!onCreateOption) return;
      if (typeof ref === 'function' || !ref?.current) return;

      if (!ref.current.value) {
        ref.current.focus();
        return;
      }

      await onCreateOption(ref.current.value);
      ref.current.value = '';
    });

  return (
    <InputRoot className={className}>
      <Input
        className={twMerge('pr-12', inputClassName)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onCreate();
          }
        }}
        placeholder={`Add ${optionName}…`}
        ref={ref}
        {...rest}
      />
      <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-start">
        <IconButton
          className="m-0 mt-px px-3 py-2.5"
          tabIndex={-1}
          icon={<PlusIcon className="w-5" />}
          label={`Add ${optionName}`}
          loading={isTransitioning}
          loadingText={`Adding ${optionName}…`}
          onClick={onCreate}
        />
      </div>
    </InputRoot>
  );
});

SelectCreateOptionInput.displayName = 'CreateInput';

export interface Option {
  id: string;
  label: React.ReactNode;
}

interface SelectProps {
  isMulti?: boolean;
  isReorderable?: boolean;
  onChange: (value: string | string[]) => void;
  onCreateOption?: (value: string) => Promise<void>;
  optionName?: string;
  options: Option[];
  placeholder?: string;
  value: string | string[];
}

const Select = ({
  isMulti,
  isReorderable,
  onChange,
  onCreateOption,
  optionName = 'option',
  options,
  placeholder,
  value,
}: SelectProps) => {
  const [, startTransition] = React.useTransition();
  const [filteredOptions, setFilteredOptions] = React.useState<Option[]>([]);
  const filterRef = React.useRef<HTMLInputElement>(null);
  const optionsLen = options.length;
  const optionsMap = new Map(options.map((option) => [option.id, option]));
  const prevOptionsLen = usePrevious(optionsLen);

  const toggleGroupProps = isMulti
    ? {
        onValueChange: onChange as (value: string[]) => void,
        type: 'multiple' as const,
        value: value as string[],
      }
    : {
        onValueChange: onChange as (value: string) => void,
        type: 'single' as const,
        value: value as string,
      };

  const fuse = React.useMemo(
    () => new Fuse(options, { keys: ['label'], threshold: 0.3 }),
    [options],
  );

  const filterOptions = React.useCallback(
    (value: string) =>
      setFilteredOptions(fuse.search(value).map((result) => result.item)),
    [fuse],
  );

  const onFilter = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    startTransition(() => {
      if (value) filterOptions(value);
      else setFilteredOptions(options);
    });

  React.useEffect(() => {
    if (optionsLen !== prevOptionsLen) {
      setFilteredOptions(options);
      if (filterRef.current?.value) filterOptions(filterRef.current.value);
    }
  }, [filterOptions, options, optionsLen, prevOptionsLen]);

  if (options.length < 8 && !isReorderable) {
    return (
      <>
        {!!options.length && (
          <ToggleGroup.Root
            className={twMerge(onCreateOption && 'rounded-b-none border-b-0')}
            {...toggleGroupProps}
          >
            {options.map((option) => (
              <ToggleGroup.Item key={option.id} value={option.id}>
                {option.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        )}
        {onCreateOption && (
          <SelectCreateOptionInput
            inputClassName={twMerge(options.length && 'rounded-t-none')}
            onChange={onFilter}
            onCreateOption={onCreateOption}
            optionName={optionName}
            ref={filterRef}
          />
        )}
      </>
    );
  }

  return (
    <Drawer.Root>
      {isMulti && !!value.length && (
        <ToggleGroup.Root
          className="rounded-b-none border-b-0"
          {...toggleGroupProps}
        >
          {options
            .filter((option) => value.includes(option.id))
            .map((option) => (
              <ToggleGroup.Item key={option.id} value={option.id}>
                {option.label}
              </ToggleGroup.Item>
            ))}
        </ToggleGroup.Root>
      )}
      <div
        className={twMerge(isMulti && value.length && 'rounded-b bg-alpha-1')}
      >
        <Drawer.Trigger
          asChild={false}
          className={twMerge(
            'input flex items-center justify-between',
            isMulti && value.length && 'rounded-t-none',
          )}
        >
          {!isMulti && value ? (
            optionsMap.get(value as string)?.label
          ) : (
            <span className="text-fg-4">
              {placeholder ??
                (isMulti
                  ? `Select  ${optionName}s…`
                  : `Select an ${optionName}…`)}
            </span>
          )}
          <ChevronUpDownIcon className="-mr-2 w-5 transition-colors group-hover:text-fg-2" />
        </Drawer.Trigger>
      </div>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Select ${optionName}s</Drawer.Title>
          <Drawer.Description />
          <ToggleGroup.Root
            className="max-h-[calc(95dvh-12rem)] overflow-y-auto rounded-b-none border-b-0"
            {...toggleGroupProps}
          >
            {filteredOptions.map((option) => (
              <ToggleGroup.Item key={option.id} value={option.id}>
                {option.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
          <SelectCreateOptionInput
            inputClassName={twMerge(filteredOptions.length && 'rounded-t-none')}
            onChange={onFilter}
            onCreateOption={onCreateOption}
            optionName={optionName}
            placeholder={
              onCreateOption
                ? `Filter or add ${optionName}s…`
                : `Filter ${optionName}s…`
            }
            ref={filterRef}
          />
          <Drawer.Close asChild>
            <Button
              className="mx-auto mt-4 w-full justify-center"
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

Select.displayName = 'Select';

export default Select;
