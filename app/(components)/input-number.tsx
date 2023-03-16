import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as numberInput from '@zag-js/number-input';
import { normalizeProps, useMachine } from '@zag-js/react';
import { InputHTMLAttributes, ReactNode, Ref, forwardRef } from 'react';
import IconButton from './icon-button';
import Input from './input';

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label?: string;
  right?: ReactNode;
  value?: string;
}

const NumberInput = forwardRef(
  (
    { label, name, value, ...rest }: NumberInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [state, send] = useMachine(
      numberInput.machine({ id: name ?? '', value })
    );

    const api = numberInput.connect(state, send, normalizeProps);

    return (
      <div className="group" {...api.rootProps}>
        {label && (
          <label className="label" {...api.labelProps}>
            {label}
          </label>
        )}
        <div className="flex">
          <IconButton
            className="rounded-r-none"
            colorScheme="transparent"
            icon={<MinusIcon className="w-5" />}
            variant="primary"
            {...api.decrementTriggerProps}
          />
          <Input
            className="rounded-none border-x-0 text-center"
            {...api.inputProps}
            {...rest}
            ref={ref}
          />
          <IconButton
            className="rounded-l-none"
            colorScheme="transparent"
            icon={<PlusIcon className="w-5" />}
            variant="primary"
            {...api.incrementTriggerProps}
          />
        </div>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
export default NumberInput;
