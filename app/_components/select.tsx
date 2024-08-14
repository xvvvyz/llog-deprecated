'use client';

import Spinner from '@/_components/spinner';
import Tip from '@/_components/tip';
import forceArray from '@/_utilities/force-array';
import ChevronUpDownIcon from '@heroicons/react/24/outline/ChevronUpDownIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { forwardRef, ReactNode, Ref } from 'react';
import Creatable, { CreatableProps } from 'react-select/creatable';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';

import ReactSelect, {
  ClearIndicatorProps,
  components,
  ControlProps,
  GroupBase,
  GroupHeadingProps,
  InputProps,
  MenuProps,
  MultiValueGenericProps,
  MultiValueRemoveProps,
  OptionProps,
  PlaceholderProps,
  Props as ReactSelectProps,
  SelectInstance,
  SingleValueProps,
  ValueContainerProps,
} from 'react-select';

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
    tooltip?: ReactNode;
  };

const ClearIndicator = <TOption extends IOption>(
  props: ClearIndicatorProps<TOption>,
) => (
  <components.ClearIndicator {...props}>
    <div className="cursor-pointer p-1 text-fg-3 transition-colors hover:text-fg-2 active:text-fg-2">
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
    selectProps.options.length >
    forceArray(selectProps.value as TOption | TOption[]).length;

  return (
    <components.Control
      className={twMerge(
        'input p-1 group-hover:bg-alpha-2',
        menuIsOpen &&
          !(!hasNoOptionsMessage && !hasOptions) &&
          'rounded-b-none focus-within:ring-0',
        selectProps.isDisabled &&
          'disabled group-hover:bg-alpha-1 group-active:bg-alpha-1',
        selectProps.className,
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
  <ChevronUpDownIcon className="mx-1 w-5 text-fg-3 transition-colors group-hover:text-fg-2 group-active:text-fg-2" />
);

const GroupHeading = <TOption extends IOption>(
  props: GroupHeadingProps<TOption>,
) => <components.GroupHeading className="smallcaps p-4 text-fg-4" {...props} />;

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
  <components.Menu className="rounded-b bg-bg-2 drop-shadow" {...props}>
    <div className="rounded-b border border-t-0 border-alpha-1 bg-alpha-2">
      {children}
    </div>
  </components.Menu>
);

const MultiValueContainer = ({
  children,
  ...props
}: MultiValueGenericProps) => (
  <div className="-m-px max-w-[calc(100%-2em)]">
    <components.MultiValueContainer {...props}>
      <div className="m-1 inline-flex max-w-full items-center gap-1.5 rounded-sm border border-alpha-1 bg-alpha-2 text-sm leading-6">
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
          className="ml-0.5 mr-0.5 size-5"
          file={props.data.image_uri}
          id={props.data.id}
        />
      )}
      <span
        className={twMerge(
          'whitespace-normal py-0.5 leading-snug',
          !(props.selectProps as SelectProps<TOption>).hasAvatar && 'pl-2',
        )}
      >
        {children}
      </span>
      {props.data.subjects && !!props.data.subjects.length && (
        <div className="mr-2 flex">
          {(props.data.subjects as NonNullable<IOption['subjects']>).map(
            ({ id, image_uri }) => (
              <Avatar
                className={twMerge(
                  '-mr-2 size-5',
                  props.data.subjects.length > 1 &&
                    'border border-alpha-reverse-1 bg-bg-2',
                )}
                file={image_uri}
                key={id}
                id={id}
              />
            ),
          )}
        </div>
      )}
    </div>
  </components.MultiValueLabel>
);

const MultiValueRemove = (props: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <div className="-m-1 p-1 pr-1.5 text-fg-3 transition-colors hover:text-fg-2 active:text-fg-2">
      <XMarkIcon className="w-5" />
    </div>
  </components.MultiValueRemove>
);

const NoOptionsMessage = ({ children }: { children: ReactNode }) => (
  <div className="p-2 text-center text-fg-3">{children}</div>
);

const Option = <TOption extends IOption>({
  children,
  ...props
}: OptionProps<TOption>) => (
  <components.Option {...props}>
    <div
      className={twMerge(
        'flex items-center gap-4 px-4 py-2 leading-snug text-fg-3 transition-colors hover:cursor-pointer',
        props.isDisabled && 'disabled',
        props.isFocused && 'bg-alpha-1 text-fg-2',
      )}
    >
      {(props.selectProps as SelectProps<TOption>).hasAvatar && (
        <Avatar
          className="size-6"
          file={props.data.image_uri}
          id={props.data.id}
        />
      )}
      <span>{children}</span>
      {props.data.subjects && !!props.data.subjects.length && (
        <div className="mr-2 flex">
          {props.data.subjects.map(({ id, image_uri }) => (
            <Avatar
              className={twMerge(
                '-mr-2 size-6',
                props.data.subjects!.length > 1 &&
                  'border border-alpha-reverse-1 bg-bg-2',
              )}
              file={image_uri}
              key={id}
              id={id}
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
  <components.Placeholder className="m-1 pl-2 text-fg-4" {...props}>
    {children}
  </components.Placeholder>
);

const SingleValue = <TOption extends IOption>({
  children,
  ...props
}: SingleValueProps<TOption>) => (
  <components.SingleValue
    className="m-1 flex items-center gap-4 !whitespace-normal px-2"
    {...props}
  >
    {(props.selectProps as SelectProps<TOption>).hasAvatar && (
      <Avatar
        className="size-6"
        file={props.data.image_uri}
        id={props.data.id}
      />
    )}
    {children}
  </components.SingleValue>
);

const ValueContainer = <TOption extends IOption>({
  children,
  ...props
}: ValueContainerProps<TOption>) => (
  <components.ValueContainer
    // hack to fix select values not showing up on ios
    className="!overflow-visible"
    {...props}
  >
    {children}
  </components.ValueContainer>
);

const Select = <TOption extends IOption>(
  {
    instanceId,
    isCreatable,
    isDisabled,
    isLoading,
    label,
    name,
    options,
    placeholder,
    tooltip,
    value,
    ...props
  }: SelectProps<TOption>,
  ref: Ref<SelectInstance<IOption, boolean, GroupBase<IOption>>>,
) => {
  const commonProps = {
    closeMenuOnSelect: !props.isMulti,
    components: {
      ClearIndicator,
      Control,
      DropdownIndicator,
      GroupHeading,
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
      ValueContainer,
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
      isCreatable ? 'Type to create an option.' : 'No options.',
    options,
    placeholder: placeholder ?? <>&nbsp;</>,
    unstyled: true,
    value: value ?? [],
    ...props,
  };

  return (
    <div className="group">
      <div className="flex justify-between">
        {label && (
          <label className="label" htmlFor={`react-select-${name}-input`}>
            {label}
          </label>
        )}
        {tooltip && (
          <Tip className="relative -top-1 -mr-[0.2rem]" side="left">
            {tooltip}
          </Tip>
        )}
      </div>
      <div className="hidden px-4 print:block">
        {options?.map((option, i) => (
          <span key={`${i}-${option.label}-label`}>
            {option.label}
            {i < options.length - 1 && ', '}
          </span>
        ))}
      </div>
      <div className="print:hidden">
        {isCreatable ? (
          <Creatable ref={ref} {...commonProps} />
        ) : (
          <ReactSelect ref={ref} {...commonProps} />
        )}
      </div>
    </div>
  );
};

Select.displayName = 'Select';
export type { IOption };
export default forwardRef(Select);
