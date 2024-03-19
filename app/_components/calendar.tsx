'use client';

import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';
import { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import { twMerge } from 'tailwind-merge';

const Calendar = ({
  className,
  classNames,
  ...props
}: ComponentProps<typeof DayPicker>) => (
  <DayPicker
    showOutsideDays
    className={twMerge('p-3', className)}
    classNames={{
      caption: 'flex justify-center pt-1 relative items-center',
      cell: 'p-0 group',
      day: 'h-9 w-9 rounded-sm transition-colors hover:bg-alpha-2 border border-transparent focus:ring-1 focus:ring-accent-2 focus:outline-none font-normal',
      day_disabled: 'disabled',
      day_hidden: 'invisible',
      day_outside: 'text-fg-4',
      day_range_end:
        'rounded-r-sm aria-selected:border-alpha-1 aria-selected:border-l-transparent aria-selected:group-first:border-l-alpha-1 rounded-l-none group-first:rounded-l-sm bg-alpha-2',
      day_range_middle:
        'bg-alpha-2 border-y-alpha-1 aria-selected:rounded-none group-last:border-r-alpha-1 group-first:border-l-alpha-1 group-last:rounded-r-sm group-first:rounded-l-sm',
      day_range_start:
        'rounded-l-sm rounded-r-none group-last:rounded-r-sm aria-selected:group-last:border-r-alpha-1 aria-selected:border-alpha-1 aria-selected:border-r-transparent bg-alpha-2',
      head_cell: 'w-9 text-fg-4 font-normal',
      head_row: 'flex mb-1 mt-0.5',
      month: 'space-y-4',
      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
      nav: 'space-x-1 flex items-center',
      nav_button:
        'p-3 -m-3 p-0 focus:outline-none transition-colors absolute text-fg-3 hover:text-fg-2',
      nav_button_next: '-right-2',
      nav_button_previous: 'left-1',
      row: 'flex w-full mt-2',
      table: 'w-full text-sm border-collapse',
      ...classNames,
    }}
    components={{
      IconLeft: () => <ChevronLeftIcon className="w-5" />,
      IconRight: () => <ChevronRightIcon className="w-5" />,
    }}
    {...props}
  />
);

Calendar.displayName = 'Calendar';
export default Calendar;
