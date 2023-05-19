'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PollingRefresh = ({ frequency = 10 }) => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(router.refresh, frequency * 1000);
    return () => clearInterval(interval);
  }, [frequency, router.refresh]);

  return null;
};

export default PollingRefresh;
