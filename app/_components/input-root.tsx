import * as React from 'react';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const InputRoot = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={twMerge('group relative', className)} ref={ref} {...props} />
));

InputRoot.displayName = 'InputRoot';

export default InputRoot;
