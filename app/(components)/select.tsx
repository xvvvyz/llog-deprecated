'use client';

import { PlusIcon } from '@heroicons/react/20/solid';
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ForwardedRef, forwardRef, ReactNode } from 'react';
import Creatable, { CreatableProps } from 'react-select/creatable';
import { twMerge } from 'tailwind-merge';

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

type IOption = {
  id: string;
  label?: string;
  name?: string;
};

const ClearIndicator = <TOption extends IOption>(
  props: ClearIndicatorProps<TOption>
) => (
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
        selectProps.isDisabled && 'opacity-50',
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
    className="w-0 focus-within:m-1 focus-within:w-auto focus-within:px-2"
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
    <div className="rounded-b border border-t-0 border-alpha-2 bg-alpha-1">
      {children}
    </div>
  </components.Menu>
);

const MultiValueContainer = ({
  children,
  ...props
}: MultiValueGenericProps) => (
  <components.MultiValueContainer {...props}>
    <div className="m-1 inline-flex max-w-[10rem] items-center gap-2 rounded-[0.25rem] bg-alpha-2 pl-2 text-sm leading-6">
      {children}
    </div>
  </components.MultiValueContainer>
);

const MultiValueRemove = (props: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <div className="group -m-1 p-1 pr-2">
      <XMarkIcon className="w-5 text-fg-2 transition-colors group-hover:text-fg-1" />
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
  <components.Placeholder className="m-1 px-2 text-fg-3" {...props}>
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
    }: ReactSelectProps<TOption> &
      CreatableProps<IOption, boolean, GroupBase<IOption>> & {
        creatable?: boolean;
      },
    ref: ForwardedRef<SelectInstance<IOption, boolean, GroupBase<IOption>>>
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
      getOptionLabel: (option: IOption) => option.label ?? option.name ?? '',
      getOptionValue: (option: IOption) => option.id,
      instanceId: props.name,
      isClearable: true,
      placeholder: placeholder ?? <>&nbsp;</>,
      unstyled: true,
      ...props,
    };

    return creatable ? (
      <Creatable ref={ref} {...commonProps} />
    ) : (
      <ReactSelect ref={ref} {...commonProps} />
    );
  }
);

Select.displayName = 'Select';
export type { IOption };
export default Select;
