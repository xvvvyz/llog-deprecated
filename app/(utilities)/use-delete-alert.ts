import { useEffect, useTransition } from 'react';
import { useBoolean } from 'usehooks-ts';
import usePrevious from './use-previous';

const useDeleteAlert = () => {
  const [isTransitioning, startTransition] = useTransition();
  const deleteAlert = useBoolean();
  const isConfirming = useBoolean();
  const isTransitioningPrevious = usePrevious(isTransitioning);

  useEffect(() => {
    if (!isTransitioning && isTransitioningPrevious) {
      deleteAlert.setFalse();
      isConfirming.setFalse();
    }
  }, [deleteAlert, isConfirming, isTransitioning, isTransitioningPrevious]);

  return { deleteAlert, isConfirming, startTransition };
};

export default useDeleteAlert;
