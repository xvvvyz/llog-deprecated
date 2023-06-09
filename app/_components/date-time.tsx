'use client';

import formatDate from '@/_utilities/format-date';
import formatDateTime from '@/_utilities/format-date-time';
import formatRelativeTime from '@/_utilities/format-relative-time';
import formatTime from '@/_utilities/format-time';
import { useEffect, useState } from 'react';

const formatters = {
  date: formatDate,
  'date-time': formatDateTime,
  relative: formatRelativeTime,
  time: formatTime,
};

interface DateTimeProps {
  className?: string;
  date: string;
  formatter: keyof typeof formatters;
}

const DateTime = ({ className, date, formatter }: DateTimeProps) => {
  const [dateString, setDateString] = useState<string>();

  useEffect(() => {
    setDateString(formatters[formatter](date));
  }, [date, formatter]);

  return (
    <time className={className} dateTime={date}>
      {dateString}
    </time>
  );
};

export default DateTime;
