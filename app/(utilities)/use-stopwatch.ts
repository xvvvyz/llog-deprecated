import { useEffect, useState } from 'react';
import { useBoolean } from 'usehooks-ts';
import parseSeconds from './parse-seconds';

const useStopwatch = (initialTime = '0') => {
  const [time, setTime] = useState(initialTime);
  const isRunning = useBoolean();

  useEffect(() => {
    if (isRunning.value) {
      const interval = setInterval(() => {
        setTime((time) => (Number(time) + 0.01).toFixed(2));
      }, 10);

      return () => clearInterval(interval);
    }
  }, [isRunning.value]);

  return {
    ...parseSeconds(time),
    hasTime: time !== '0',
    isRunning: isRunning.value,
    reset: () => setTime('0'),
    start: isRunning.setTrue,
    stop: isRunning.setFalse,
    time,
    toggle: isRunning.toggle,
  };
};

export default useStopwatch;
