'use client';

import formatDate from '@/(account)/_utilities/format-date';
import formatDateTime from '@/(account)/_utilities/format-date-time';
import formatRelativeTime from '@/(account)/_utilities/format-relative-time';
import formatTime from '@/(account)/_utilities/format-time';
import { useEffect, useState } from 'react';

const formatters = {
  date: formatDate,
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
