import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Logo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      className={twMerge('size-7', className)}
      fill="none"
      ref={ref}
      viewBox="0 0 1000 1000"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="#f7bb08" height="1000" rx="500" width="1000" />
      <g fill="#1f1f1f">
        <rect
          height="217.619"
          rx="36.0269"
          stroke="#1f1f1f"
          width="72.0539"
          x="409.482"
          y="354.5"
        />
        <rect
          height="144.345"
          rx="36.0269"
          stroke="#1f1f1f"
          width="72.0539"
          x="627.446"
          y="501.047"
        />
        <rect
          height="217.619"
          rx="36.0269"
          stroke="#1f1f1f"
          width="72.0539"
          x="300.5"
          y="354.5"
        />
        <ellipse cx="554.491" cy="536.583" rx="36.5269" ry="36.036" />
      </g>
    </svg>
  ),
);

Logo.displayName = 'Logo';

export default Logo;
