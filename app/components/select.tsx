'use client';

import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/solid';

import ReactSelect, {
  ClearIndicatorProps,
  components,
  ControlProps,
  InputProps,
  MenuProps,
  MultiValueGenericProps,
  MultiValueRemoveProps,
  NoticeProps,
  OptionProps,
  PlaceholderProps,
  Props as ReactSelectProps,
  SingleValueProps,
} from 'react-select';

import { PlusIcon } from '@heroicons/react/20/solid';
import { forwardRef, Ref } from 'react';
import Creatable from 'react-select/creatable';
import ReactSelectDeclaration from 'react-select/dist/declarations/src/Select';
import { twMerge } from 'tailwind-merge';

type IOption =
  | {
      id: string;
      label?: string;
      name?: string;
    }
  | string;

const ClearIndicator = <TOption extends IOption>({
  children,
  ...props
}: ClearIndicatorProps<TOption>) => (
  <components.ClearIndicator {...props}>
    <div className="group cursor-pointer p-1">
      <XMarkIcon className="w-5 text-fg-2 transition-colors group-hover:text-fg-1" />
    </div>
  </components.ClearIndicator>
);

const Control = <TOption extends IOption>({
  children,
  menuIsOpen,
  selectProps,
  ...props
}: ControlProps<TOption>) => {
  return (
    <components.Control
      className={twMerge(
        'input p-1',
        menuIsOpen && 'rounded-b-none focus-within:ring-0',
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

const DropdownIndicator = () => <ChevronUpDownIcon className="mr-1 w-5" />;

const Input = <TOption extends IOption>({
  children,
  ...props
}: InputProps<TOption>) => (
  <components.Input
    className={props.value ? 'caret-initial m-1 px-2' : 'caret-transparent'}
    {...props}
  >
    {children}
  </components.Input>
);

const Menu = <TOption extends IOption>({
  children,
  ...props
}: MenuProps<TOption>) => (
  <components.Menu
    className="overflow-hidden rounded-b bg-bg-1 shadow-md sm:bg-bg-2"
    {...props}
  >
    <div className="rounded-b border border-t-0 border-alpha-3 bg-alpha-1">
      {children}
    </div>
  </components.Menu>
);

const MultiValueContainer = ({
  children,
  ...props
}: MultiValueGenericProps) => (
  <components.MultiValueContainer {...props}>
    <div className="m-1 inline-flex max-w-[10rem] items-center gap-2 rounded-[0.15rem] bg-alpha-2 pl-2 text-sm leading-6">
      {children}
    </div>
  </components.MultiValueContainer>
);

const MultiValueRemove = ({ children, ...props }: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <div className="group -m-1 p-1 pr-2">
      <XMarkIcon className="w-5 text-fg-2 transition-colors group-hover:text-fg-1" />
    </div>
  </components.MultiValueRemove>
);

const NoOptionsMessage = <TOption extends IOption>({
  children,
  ...props
}: NoticeProps<TOption>) => (
  <components.NoOptionsMessage className="p-2 text-fg-2" {...props}>
    {children}
  </components.NoOptionsMessage>
);

const Option = <TOption extends IOption>({
  children,
  ...props
}: OptionProps<TOption>) => (
  <components.Option {...props}>
    <div
      className={twMerge(
        'flex items-center justify-between px-4 py-2 text-fg-2 transition-colors hover:cursor-pointer',
        props.isFocused && 'bg-alpha-1 text-fg-1'
      )}
    >
      {children}
      {props.isMulti && <PlusIcon className="-mr-2 w-5 transition-colors" />}
    </div>
  </components.Option>
);

const Placeholder = <TOption extends IOption>({
  children,
  ...props
}: PlaceholderProps<TOption>) => (
  <components.Placeholder className="m-1 px-2 text-alpha-4" {...props}>
    {children}
  </components.Placeholder>
);

const SingleValue = <TOption extends IOption>({
  children,
  ...props
}: SingleValueProps<TOption>) => (
  <components.SingleValue className="m-1 px-2" {...props}>
    {children}
  </components.SingleValue>
);

const Select = forwardRef(
  <TOption extends IOption>(
    {
      creatable,
      placeholder,
      ...props
    }: ReactSelectProps<TOption> & { creatable?: boolean },
    ref: Ref<ReactSelectDeclaration<TOption>>
  ) => {
    const commonProps = {
      closeMenuOnSelect: !props.isMulti,
      components: {
        ClearIndicator,
        Control,
        DropdownIndicator,
        Input,
        Menu,
        MultiValueContainer,
        MultiValueRemove,
        NoOptionsMessage,
        Option,
        Placeholder,
        SingleValue,
      },
      instanceId: props.name,
      isClearable: true,
      placeholder: placeholder ?? <>&nbsp;</>,
      ref: () => ref,
      unstyled: true,
      ...props,
    };

    if (creatable) {
      return <Creatable {...commonProps} />;
    }

    return (
      <ReactSelect
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? option
            : option.label ?? option.name ?? ''
        }
        getOptionValue={(option) =>
          typeof option === 'string' ? option : option.id
        }
        {...commonProps}
      />
    );
  }
);

Select.displayName = 'Select';
export default Select;
