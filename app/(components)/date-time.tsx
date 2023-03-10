'use client';

import formatDate from '(utilities)/format-date';
import formatDateTime from '(utilities)/format-date-time';
import formatTime from '(utilities)/format-time';
import formatTimeSince from '../(utilities)/format-time-since';

const formatters = {
  date: formatDate,
  'date-time': formatDateTime,
  time: formatTime,
  'time-since': formatTimeSince,
};

interface DateTimeProps {
  className?: string;
  date: string;
  formatter: keyof typeof formatters;
}

const DateTime = ({ className, date, formatter }: DateTimeProps) => (
  <time className={className} dateTime={date} suppressHydrationWarning>
    {formatters[formatter](date)}
  </time>
);

export default DateTime;
