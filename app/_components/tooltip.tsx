'use client';

import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { normalizeProps, useMachine } from '@zag-js/react';
import * as tooltip from '@zag-js/tooltip';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TooltipProps {
  className?: string;
  id: string;
  placement?: tooltip.Placement;
  tip: ReactNode;
  tipClassName?: string;
}

const Tooltip = ({
  className,
  id,
  placement = 'right',
  tip,
  tipClassName,
}: TooltipProps) => {
  const [state, send] = useMachine(
    tooltip.machine({
      closeDelay: 200,
      id,
      openDelay: 200,
      positioning: { offset: { mainAxis: 3 }, placement },
    }),
  );

  const api = tooltip.connect(state, send, normalizeProps);

  return (
    <>
      <button
        {...api.triggerProps}
        className={twMerge('-m-3 p-3', className)}
        type="button"
      >
        <InformationCircleIcon className="w-5 text-fg-3" />
      </button>
      {api.open && (
        <div
          className="rounded border border-alpha-1 bg-bg-3 px-6 py-5 text-fg-1 shadow-lg"
          {...api.positionerProps}
        >
          <div
            className={twMerge('z-10 max-w-[17rem]', tipClassName)}
            {...api.contentProps}
          >
            {tip}
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
