'use client';

import Button from '@/_components/button';
import Calendar from '@/_components/calendar';
import Popover from '@/_components/popover';
import formatDate from '@/_utilities/format-date';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

const SubjectEventsDateFilter = () => {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button colorScheme="transparent" disabled size="sm">
          <CalendarDaysIcon className="-ml-0.5 w-5" />
          {date?.from ? (
            date.to ? (
              <>
                {formatDate(date.from, { month: 'short', weekday: undefined })}{' '}
                &ndash;{' '}
                {formatDate(date.to, { month: 'short', weekday: undefined })}
              </>
            ) : (
              formatDate(date.from, { weekday: undefined })
            )
          ) : (
            'Filter by date'
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" className="my-2" sideOffset={0}>
        <Calendar
          disabled={{ after: new Date() }}
          initialFocus
          mode="range"
          selected={date}
          onSelect={setDate}
        />
      </Popover.Content>
    </Popover>
  );
};

export default SubjectEventsDateFilter;
