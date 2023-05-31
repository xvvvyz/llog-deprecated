'use client';

import Empty from '@/_components/empty';

const Error = ({ message = 'An unknown error occurred' }) => (
  <Empty>{message}</Empty>
);

export default Error;
