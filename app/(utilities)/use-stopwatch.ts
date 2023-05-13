import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoolean, useDebounce } from 'usehooks-ts';
import parseSeconds from './parse-seconds';

const useStopwatch = (initialTime: string | number) => {
  const [time, setTime] = useState(+initialTime || 0);
  const frameId = useRef<number | undefined>();
  const isRunning = useBoolean();
  const startTime = useRef<number>(0);

  const update = useCallback(() => {
    if (isRunning.value) {
      setTime((performance.now() - startTime.current) / 1000);
      frameId.current = requestAnimationFrame(update);
    }
  }, [isRunning.value]);

  useEffect(() => {
    if (isRunning.value) {
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
  }, [isRunning.value]);

  const reset = useCallback(() => {
    setTime(0);
    startTime.current = 0;

    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = undefined;
    }

    isRunning.setFalse();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...parseSeconds(time),
    debouncedTime: useDebounce(time, 1000),
    hasTime: time !== 0,
    isRunning: isRunning.value,
    reset,
    start: isRunning.setTrue,
    stop: isRunning.setFalse,
    time,
    toggle: isRunning.toggle,
  };
};

export default useStopwatch;
