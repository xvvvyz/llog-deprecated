'use client';

import formatDate from '@/_utilities/format-date';
import formatDateTime from '@/_utilities/format-date-time';
import formatRelativeTime from '@/_utilities/format-relative-time';
import formatTime from '@/_utilities/format-time';
import { useEffect, useState } from 'react';

const formatters = {
  date: formatDate,
  'date-short': (input: Date | string) =>
    formatDate(input, { day: 'numeric', month: 'numeric', weekday: undefined }),
  'date-time': formatDateTime,
  relative: formatRelativeTime,
  time: formatTime,
};

interface DateTimeProps {
  className?: string;
  date: string | Date;
  formatter: keyof typeof formatters;
}

const DateTime = ({ className, date, formatter }: DateTimeProps) => {
  const [dateString, setDateString] = useState<string | undefined>('-');

  useEffect(() => {
    setDateString(formatters[formatter](date));
  }, [date, formatter]);

  return (
    <time className={className} dateTime={new Date(date).toISOString()}>
      {dateString}
    </time>
  );
};

export default DateTime;
