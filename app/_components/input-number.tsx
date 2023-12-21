import { NumberInput as ArkNumberInput } from '@ark-ui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { InputHTMLAttributes, ReactNode, Ref, forwardRef } from 'react';

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id?: string;
  label?: string;
  max?: number | string;
  maxFractionDigits?: number | string;
  min?: number | string;
  minFractionDigits?: number | string;
  name: string;
  onChange?: (value: number) => void;
  right?: ReactNode;
  value?: string;
}

const NumberInput = forwardRef(
  (
    {
      id,
      label,
      max = Number.MAX_SAFE_INTEGER,
      maxFractionDigits = 0,
      min = Number.MIN_SAFE_INTEGER,
      minFractionDigits = 0,
      name,
      onBlur,
      onChange,
      placeholder,
      value,
    }: NumberInputProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <ArkNumberInput.Root
      className="relative"
      defaultValue={value}
      formatOptions={{
        maximumFractionDigits: Number(maxFractionDigits),
        minimumFractionDigits: Number(minFractionDigits),
      }}
      id={id ?? name}
      max={Number(max)}
      min={Number(min)}
      name={name}
      onBlurCapture={onBlur}
      onValueChange={({ valueAsNumber }) => onChange?.(valueAsNumber || 0)}
      value={value}
    >
      <ArkNumberInput.Label className="label">{label}</ArkNumberInput.Label>
      <ArkNumberInput.Control className="flex">
        <ArkNumberInput.DecrementTrigger className="disabled:disabled cursor-pointer rounded-l border border-alpha-3 p-3 text-fg-3 outline-none transition-colors hover:bg-alpha-1 hover:text-fg-2">
          <MinusIcon className="w-5" />
        </ArkNumberInput.DecrementTrigger>
        <ArkNumberInput.Input
          autoComplete="off"
          className="input rounded-none border-x-0 px-0 text-center"
          placeholder={placeholder}
          ref={ref}
        />
        <ArkNumberInput.IncrementTrigger className="disabled:disabled cursor-pointer rounded-r border border-alpha-3 p-3 text-fg-3 outline-none transition-colors hover:bg-alpha-1 hover:text-fg-2">
          <PlusIcon className="w-5" />
        </ArkNumberInput.IncrementTrigger>
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  ),
);

NumberInput.displayName = 'NumberInput';
export default NumberInput;
