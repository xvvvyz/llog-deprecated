'use client';

import Button from '@/_components/button';
import Calendar from '@/_components/calendar';
import * as Popover from '@/_components/popover';
import formatDate from '@/_utilities/format-date';
import formatShortIso from '@/_utilities/format-short-iso';
import parseShortIso from '@/_utilities/parse-short-iso';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { DateRange } from 'react-day-picker';

const SubjectEventsDateFilter = () => {
  const [isTransitioning, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  let date: DateRange | undefined;

  try {
    const from = searchParams.get('from');

    if (from) {
      const to = searchParams.get('to');

      date = {
        from: new Date(parseShortIso(from)),
        to: to ? new Date(parseShortIso(to)) : undefined,
      };
    }
  } catch {
    // noop
  }

  const [opDate, setOpDate] = useOptimistic<DateRange | undefined>(date);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button colorScheme="transparent" loading={isTransitioning} size="sm">
          {!isTransitioning && <CalendarDaysIcon className="-ml-0.5 w-5" />}
          {opDate?.from && opDate?.to ? (
            <>
              {formatDate(opDate.from, { month: 'short', weekday: undefined })}
              &nbsp;&ndash;&nbsp;
              {formatDate(opDate.to, { month: 'short', weekday: undefined })}
            </>
          ) : opDate?.from ? (
            formatDate(opDate.from, { weekday: undefined })
          ) : (
            'Filter by date range'
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content align="start">
        <Calendar
          defaultMonth={opDate?.to ?? opDate?.from}
          disabled={{ after: new Date() }}
          mode="range"
          selected={opDate}
          onSelect={(value) =>
            startTransition(() => {
              const newSearchParams = new URLSearchParams(searchParams);

              if (value?.from) {
                newSearchParams.set('from', formatShortIso(value.from));
              } else {
                newSearchParams.delete('from');
              }

              if (value?.to) {
                newSearchParams.set('to', formatShortIso(value.to));
              } else {
                newSearchParams.delete('to');
              }

              const searchString = newSearchParams.toString();
              const delimiter = searchString ? '?' : '';
              const url = `${pathname}${delimiter}${searchString}`;
              router.replace(url, { scroll: false });
              setOpDate(value);
            })
          }
        />
        <div className="flex justify-center pb-3">
          <Button
            disabled={!date}
            onClick={() =>
              startTransition(() => {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('from');
                newSearchParams.delete('to');
                const searchString = newSearchParams.toString();
                const delimiter = searchString ? '?' : '';
                const url = `${pathname}${delimiter}${searchString}`;
                router.replace(url, { scroll: false });
                setOpDate(undefined);
              })
            }
            variant="link"
          >
            Clear
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default SubjectEventsDateFilter;
