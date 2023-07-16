import Input from '@/_components/input';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as numberInput from '@zag-js/number-input';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';
import { InputHTMLAttributes, ReactNode, Ref, forwardRef } from 'react';
import IconButton from './icon-button';

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  forceValue?: boolean;
  id: string;
  label?: string;
  max?: number | string;
  maxFractionDigits?: number | string;
  min?: number | string;
  minFractionDigits?: number | string;
  name: string;
  right?: ReactNode;
  value?: string;
}

const NumberInput = forwardRef(
  (
    {
      forceValue,
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
  ) => {
    const [state, send] = useMachine(
      numberInput.machine({
        id,
        name,
        value,
      }),
      {
        context: {
          focusInputOnChange: false,
          format: (value) => (forceValue && !value ? '0' : value),
          max: Number(max),
          maxFractionDigits: Number(maxFractionDigits),
          min: Number(min),
          minFractionDigits: Number(minFractionDigits),
        },
      },
    );

    const api = numberInput.connect(state, send, normalizeProps);

    return (
      <div {...api.rootProps} className="group">
        {label && (
          <label {...api.labelProps} className="label">
            {label}
          </label>
        )}
        <div className="flex">
          <IconButton
            {...api.decrementTriggerProps}
            className="rounded-r-none px-3"
            colorScheme="transparent"
            icon={<MinusIcon className="w-5" />}
            variant="primary"
          />
          <Input
            {...mergeProps(api.inputProps, { onBlur, onChange })}
            className="rounded-none border-x-0 px-0 text-center"
            placeholder={placeholder}
            ref={ref}
          />
          <IconButton
            {...api.incrementTriggerProps}
            className="rounded-l-none px-3"
            colorScheme="transparent"
            icon={<PlusIcon className="w-5" />}
            variant="primary"
          />
        </div>
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
export default NumberInput;
