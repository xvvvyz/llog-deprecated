import { usePrevious, useToggle } from '@uidotdev/usehooks';
import { useEffect, useTransition } from 'react';

const useDeleteAlert = () => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const [isConfirming, toggleIsConfirming] = useToggle(false);
  const [isTransitioning, startTransition] = useTransition();
  const isTransitioningPrevious = usePrevious(isTransitioning);

  useEffect(() => {
    if (!isTransitioning && isTransitioningPrevious) {
      toggleDeleteAlert(false);
      toggleIsConfirming(false);
    }
  }, [
    deleteAlert,
    isConfirming,
    isTransitioning,
    isTransitioningPrevious,
    toggleDeleteAlert,
    toggleIsConfirming,
  ]);

  return {
    deleteAlert,
    isConfirming,
    startTransition,
    toggleDeleteAlert,
    toggleIsConfirming,
  };
};

export default useDeleteAlert;
