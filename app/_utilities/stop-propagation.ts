import { BaseSyntheticEvent } from 'react';

const stopPropagation =
  (callback: (e: BaseSyntheticEvent) => Promise<void>) =>
  (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    return callback(e);
  };

export default stopPropagation;
