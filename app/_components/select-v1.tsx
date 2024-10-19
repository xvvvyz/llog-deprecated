'use client';

import Avatar from '@/_components/avatar';
import Spinner from '@/_components/spinner';
import forceArray from '@/_utilities/force-array';
import ChevronUpDownIcon from '@heroicons/react/24/outline/ChevronUpDownIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import * as React from 'react';
import ReactSelect, * as RS from 'react-select';
import Creatable, * as RCS from 'react-select/creatable';
import { twMerge } from 'tailwind-merge';

export interface IOption {
  id: string;
  image_uri?: string;
  label?: string;
  name?: string;
  subjects?: { id: string; image_uri: string; name: string }[] | null;
}

const ClearIndicator = <TOption extends IOption>(
  props: RS.ClearIndicatorProps<TOption>,
) => (
  <RS.components.ClearIndicator
    className="cursor-pointer p-1 text-fg-3 transition-colors hover:text-fg-2"
    {...props}
  >
    <XMarkIcon className="w-5" />
  </RS.components.ClearIndicator>
);

const Control = <TOption extends IOption>({
  children,
  menuIsOpen,
  selectProps,
  ...props
}: RS.ControlProps<TOption> & {
  selectProps: RS.Props<TOption, boolean, RS.GroupBase<TOption>>;
}) => {
  const hasNoOptionsMessage = !!selectProps.noOptionsMessage({
    inputValue: selectProps.inputValue,
  });

  const hasOptions =
    selectProps.options.length >
    forceArray(selectProps.value as TOption | TOption[]).length;

  return (
    <RS.components.Control
      className={twMerge(
        'input p-1',
        menuIsOpen &&
          !(!hasNoOptionsMessage && !hasOptions) &&
          'rounded-b-none focus-within:ring-0',
        selectProps.isDisabled && 'disabled group-hover:bg-alpha-1',
        selectProps.className,
      )}
      menuIsOpen={menuIsOpen}
      selectProps={selectProps}
      {...props}
    >
      {children}
    </RS.components.Control>
  );
};

const DropdownIndicator = () => (
  <ChevronUpDownIcon className="mx-1 w-5 text-fg-3 transition-colors group-hover:text-fg-2" />
);

const GroupHeading = <TOption extends IOption>(
  props: RS.GroupHeadingProps<TOption>,
) => (
  <RS.components.GroupHeading className="smallcaps p-4 text-fg-4" {...props} />
);

const Input = <TOption extends IOption>({
  children,
  selectProps,
  ...props
}: RS.InputProps<TOption>) => (
  <RS.components.Input
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
  </RS.components.Input>
);

const LoadingIndicator = () => <Spinner className="mr-1" />;

const LoadingMessage = () => null;

const Menu = <TOption extends IOption>({
  children,
  ...props
}: RS.MenuProps<TOption>) => (
  <RS.components.Menu
    className="overflow-hidden rounded-b bg-bg-2 drop-shadow"
    {...props}
  >
    <div className="rounded-b border border-t-0 border-alpha-1 bg-alpha-2">
      {children}
    </div>
  </RS.components.Menu>
);

const MultiValueContainer = ({
  children,
  ...props
}: RS.MultiValueGenericProps) => (
  <div className="-m-px max-w-[calc(100%-2em)]">
    <div className="m-1 inline-flex max-w-full items-center gap-1.5 rounded-sm border border-alpha-1 bg-alpha-2 text-sm leading-6">
      <RS.components.MultiValueContainer {...props}>
        {children}
      </RS.components.MultiValueContainer>
    </div>
  </div>
);

const MultiValueLabel = <TOption extends IOption>({
  children,
  ...props
}: RS.MultiValueGenericProps) => (
  <RS.components.MultiValueLabel {...props}>
    <div className="flex items-center gap-2 overflow-visible">
      {(props.selectProps as SelectProps<TOption>).hasAvatar && (
        <Avatar
          className="ml-0.5 size-5"
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
  </RS.components.MultiValueLabel>
);

const MultiValueRemove = (props: RS.MultiValueRemoveProps) => (
  <RS.components.MultiValueRemove {...props}>
    <div className="-m-1 py-1 pl-2 pr-1.5 text-fg-3 transition-colors hover:text-fg-2">
      <XMarkIcon className="w-5" />
    </div>
  </RS.components.MultiValueRemove>
);

const NoOptionsMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="p-2 text-center text-fg-3">{children}</div>
);

const Option = <TOption extends IOption>({
  children,
  ...props
}: RS.OptionProps<TOption>) => (
  <RS.components.Option {...props}>
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
  </RS.components.Option>
);

const Placeholder = <TOption extends IOption>({
  children,
  ...props
}: RS.PlaceholderProps<TOption>) => (
  <RS.components.Placeholder className="m-1 pl-2 text-fg-4" {...props}>
    {children}
  </RS.components.Placeholder>
);

const SingleValue = <TOption extends IOption>({
  children,
  ...props
}: RS.SingleValueProps<TOption>) => (
  <RS.components.SingleValue
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
  </RS.components.SingleValue>
);

const ValueContainer = <TOption extends IOption>({
  children,
  ...props
}: RS.ValueContainerProps<TOption>) => (
  <RS.components.ValueContainer
    // hack to fix select values not showing up on ios
    className="!overflow-visible"
    {...props}
  >
    {children}
  </RS.components.ValueContainer>
);

type SelectProps<TOption> = RS.Props<TOption> &
  RCS.CreatableProps<IOption, boolean, RS.GroupBase<IOption>> & {
    hasAvatar?: boolean;
    inputType?: 'text' | 'number';
    isCreatable?: boolean;
  };

const Select = React.forwardRef<
  RS.SelectInstance<IOption, boolean, RS.GroupBase<IOption>>,
  SelectProps<IOption>
>(
  (
    {
      instanceId,
      isCreatable,
      isDisabled,
      isLoading,
      name,
      options,
      placeholder,
      value,
      ...props
    },
    ref,
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

    if (isCreatable) return <Creatable ref={ref} {...commonProps} />;
    return <ReactSelect ref={ref} {...commonProps} />;
  },
);

Select.displayName = 'Select';

export default Select;
