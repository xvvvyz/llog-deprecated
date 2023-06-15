'use client';

import forceArray from '@/(account)/_utilities/force-array';
import Spinner from '@/_components/spinner';
import { forwardRef, ReactNode, Ref } from 'react';
import Creatable, { CreatableProps } from 'react-select/creatable';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';

import ReactSelect, {
  ClearIndicatorProps,
  components,
  ControlProps,
  GroupBase,
  InputProps,
  MenuProps,
  MultiValueGenericProps,
  MultiValueRemoveProps,
  OptionProps,
  PlaceholderProps,
  Props as ReactSelectProps,
  SelectInstance,
  SingleValueProps,
} from 'react-select';

import {
  ChevronUpDownIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type IOption = {
  id: string;
  image_uri?: string;
  label?: string;
  name?: string;
  subjects?: { id: string; image_uri: string; name: string }[] | null;
};

type SelectProps<TOption> = ReactSelectProps<TOption> &
  CreatableProps<IOption, boolean, GroupBase<IOption>> & {
    hasAvatar?: boolean;
    inputType?: 'text' | 'number';
    isCreatable?: boolean;
    label?: string;
  };

const ClearIndicator = <TOption extends IOption>(
  props: ClearIndicatorProps<TOption>
) => (
  <components.ClearIndicator {...props}>
    <div className="cursor-pointer p-1 text-fg-2 transition-colors hover:text-fg-1">
      <XMarkIcon className="w-5" />
    </div>
  </components.ClearIndicator>
);

const Control = <TOption extends IOption>({
  children,
  menuIsOpen,
  selectProps,
  ...props
}: ControlProps<TOption>) => {
  const hasNoOptionsMessage = !!selectProps.noOptionsMessage({
    inputValue: selectProps.inputValue,
  });

  const hasOptions =
    selectProps.options.length > forceArray(selectProps.value)?.length;

  return (
    <components.Control
      className={twMerge(
        'input !min-h-0 p-1 group-hover:bg-alpha-2',
        menuIsOpen &&
          !(!hasNoOptionsMessage && !hasOptions) &&
          'rounded-b-none focus-within:ring-0',
        selectProps.isDisabled && 'disabled group-hover:bg-alpha-1',
        selectProps.className
      )}
      menuIsOpen={menuIsOpen}
      selectProps={selectProps}
      {...props}
    >
      {children}
    </components.Control>
  );
};

const DropdownIndicator = () => (
  <ChevronUpDownIcon className="mx-1 w-5 text-fg-2 transition-colors group-hover:text-fg-1" />
);

const Input = <TOption extends IOption>({
  children,
  selectProps,
  ...props
}: InputProps<TOption>) => (
  <components.Input
    {...props}
    className="m-1 pl-2"
    formNoValidate={true}
    inputMode={
      (selectProps as SelectProps<TOption>).inputType === 'number'
        ? 'numeric'
        : 'text'
    }
    pattern={
      (selectProps as SelectProps<TOption>).inputType === 'number'
        ? '[0-9]*'
        : undefined
    }
    selectProps={selectProps}
    spellCheck={true}
  >
    {children}
  </components.Input>
);

const LoadingIndicator = () => <Spinner className="mr-1" />;

const LoadingMessage = () => null;

const Menu = <TOption extends IOption>({
  children,
  ...props
}: MenuProps<TOption>) => (
  <components.Menu
    className="overflow-hidden rounded-b bg-bg-2 shadow-lg"
    {...props}
  >
    <div className="rounded-b border border-t-0 border-alpha-1 bg-alpha-2">
      {children}
    </div>
  </components.Menu>
);

const MultiValueContainer = ({
  children,
  ...props
}: MultiValueGenericProps) => (
  <div className="-my-px max-w-[calc(100%-2em)]">
    <components.MultiValueContainer {...props}>
      <div className="m-1 inline-flex max-w-full items-center gap-1.5 rounded border border-alpha-1 bg-alpha-2 text-sm leading-6">
        {children}
      </div>
    </components.MultiValueContainer>
  </div>
);

const MultiValueLabel = <TOption extends IOption>({
  children,
  ...props
}: MultiValueGenericProps) => (
  <components.MultiValueLabel {...props}>
    <div className="flex items-center gap-2 overflow-visible">
      {(props.selectProps as SelectProps<TOption>).hasAvatar && (
        <Avatar
          className="ml-0.5 mr-0.5 rounded-full"
          file={props.data.image_uri}
          name={props.data.label ?? props.data.name ?? ''}
          size="xs"
        />
      )}
      <span
        className={twMerge(
          'whitespace-normal py-0.5 leading-snug',
          !(props.selectProps as SelectProps<TOption>).hasAvatar && 'pl-2'
        )}
      >
        {children}
      </span>
      {props.data.subjects && !!props.data.subjects.length && (
        <div className="mr-2 flex">
          {(props.data.subjects as NonNullable<IOption['subjects']>).map(
            ({ id, image_uri, name }) => (
              <Avatar
                className="-mr-2 rounded-full border border-alpha-reverse-2 bg-bg-2"
                file={image_uri}
                key={id}
                name={name}
                size="xs"
              />
            )
          )}
        </div>
      )}
    </div>
  </components.MultiValueLabel>
);

const MultiValueRemove = (props: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <div className="-m-1 p-1 pr-2 text-fg-2 transition-colors hover:text-fg-1">
      <XMarkIcon className="w-5" />
    </div>
  </components.MultiValueRemove>
);

const NoOptionsMessage = ({ children }: { children: ReactNode }) => (
  <div className="p-2 text-center text-fg-2">{children}</div>
);

const Option = <TOption extends IOption>({
  children,
  ...props
}: OptionProps<TOption>) => (
  <components.Option {...props}>
    <div
      className={twMerge(
        'flex items-center gap-4 px-4 py-2 leading-snug text-fg-2 transition-colors hover:cursor-pointer',
        props.isFocused && 'bg-alpha-1 text-fg-1'
      )}
    >
      {(props.selectProps as SelectProps<TOption>).hasAvatar && (
        <Avatar
          file={props.data.image_uri}
          name={props.data.label ?? props.data.name ?? ''}
          size="sm"
        />
      )}
      <span>{children}</span>
      {props.data.subjects && !!props.data.subjects.length && (
        <div className="mr-2 flex">
          {props.data.subjects.map(({ id, image_uri, name }) => (
            <Avatar
              className="-mr-2 border border-alpha-reverse-2 bg-bg-2"
              file={image_uri}
              key={id}
              name={name}
              size="sm"
            />
          ))}
        </div>
      )}
      {props.isMulti && (
        <PlusIcon className="-mr-2 ml-auto w-5 shrink-0 transition-colors" />
      )}
    </div>
  </components.Option>
);

const Placeholder = <TOption extends IOption>({
  children,
  ...props
}: PlaceholderProps<TOption>) => (
  <components.Placeholder className="m-1 px-2 text-fg-3" {...props}>
    {children}
  </components.Placeholder>
);

const SingleValue = <TOption extends IOption>({
  children,
  ...props
}: SingleValueProps<TOption>) => (
  <components.SingleValue
    className="m-1 flex items-center gap-4 px-2"
    {...props}
  >
    {(props.selectProps as SelectProps<TOption>).hasAvatar && (
      <Avatar
        file={props.data.image_uri}
        name={props.data.label ?? props.data.name ?? ''}
        size="sm"
      />
    )}
    {children}
  </components.SingleValue>
);

const Select = <TOption extends IOption>(
  {
    instanceId,
    isCreatable,
    isDisabled,
    isLoading,
    label,
    name,
    placeholder,
    ...props
  }: SelectProps<TOption>,
  ref: Ref<SelectInstance<IOption, boolean, GroupBase<IOption>>>
) => {
  const commonProps = {
    closeMenuOnSelect: !props.isMulti,
    components: {
      ClearIndicator,
      Control,
      DropdownIndicator,
      Input,
      LoadingIndicator,
      LoadingMessage,
      Menu,
      MultiValueContainer,
      MultiValueLabel,
      MultiValueRemove,
      NoOptionsMessage,
      Option,
      Placeholder,
      SingleValue,
    },
    formatCreateLabel: (value: string) => `Save "${value}" option`,
    getOptionLabel: (option: IOption) => option.label ?? option.name ?? '',
    getOptionValue: (option: IOption) => option.id,
    instanceId: instanceId ?? name,
    isClearable: true,
    isDisabled: isDisabled || isLoading,
    isLoading,
    name,
    noOptionsMessage: () =>
      isCreatable ? 'Type to create an option' : 'No options',
    placeholder: placeholder ?? <>&nbsp;</>,
    unstyled: true,
    ...props,
  };

  return (
    <label className="group">
      {label && <span className="label">{label}</span>}
      {isCreatable ? (
        <Creatable ref={ref} {...commonProps} />
      ) : (
        <ReactSelect ref={ref} {...commonProps} />
      )}
    </label>
  );
};

Select.displayName = 'Select';
export type { IOption };
export default forwardRef(Select);
