'use client';

import formatDate from 'utilities/format-date';
import formatTime from '../utilities/format-time';
import { BoxProps } from './box';

const formatters = {
  date: formatDate,
  time: formatTime,
};

type DateTimeProps = Omit<BoxProps, 'children'> & {
  date: string;
  formatter: keyof typeof formatters;
};

const DateTime = ({ date, formatter, ...rest }: DateTimeProps) => (
  <time dateTime={date} {...rest}>
    {formatters[formatter](date)}
  </time>
);

export default DateTime;
