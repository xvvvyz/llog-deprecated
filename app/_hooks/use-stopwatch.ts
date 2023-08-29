import parseSeconds from '@/_utilities/parse-seconds';
import { useToggle } from '@uidotdev/usehooks';
import { useCallback, useEffect, useRef, useState } from 'react';

const useStopwatch = (initialTime: string | number) => {
  const [isRunning, toggleIsRunning] = useToggle(false);
  const [time, setTime] = useState(+initialTime || 0);
  const frameId = useRef<number | undefined>();
  const startTime = useRef<number>(0);

  const update = useCallback(() => {
    if (isRunning) {
      setTime((performance.now() - startTime.current) / 1000);
      frameId.current = requestAnimationFrame(update);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      startTime.current = performance.now() - time * 1000;
      frameId.current = requestAnimationFrame(update);
    } else if (frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = undefined;
    }

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const reset = useCallback(() => {
    setTime(0);
    startTime.current = 0;

    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = undefined;
    }

    toggleIsRunning(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...parseSeconds(time),
    hasTime: time !== 0,
    isRunning,
    reset,
    time,
    toggle: toggleIsRunning,
  };
};

export default useStopwatch;
