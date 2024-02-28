'use client';

import debounce from 'lodash/debounce';
import { useEffect } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { FieldValues, UseFormProps } from 'react-hook-form/dist/types';

const useCachedForm = <T extends FieldValues>(
  key: string,
  args: UseFormProps<T> & { defaultValues: DefaultValues<T> },
  {
    disableCache = false,
    ignoreValues = [],
  }: { disableCache?: boolean; ignoreValues?: string[] } = {},
) => {
  const form = useForm<T>(args);

  useEffect(() => {
    if (disableCache) return;

    // allow all hooks to execute before doing anything
    requestAnimationFrame(() => {
      try {
        const cached = localStorage.getItem(key);

        if (cached) {
          form.reset(Object.assign(args.defaultValues, JSON.parse(cached)), {
            keepDefaultValues: true,
          });
        }
      } catch (e) {
        // noop
      }

      form.watch(
        debounce((values) => {
          ignoreValues.forEach((key) => delete values[key]);
          if (!form.formState.isDirty) localStorage.removeItem(key);
          else localStorage.setItem(key, JSON.stringify(values));
        }, 500),
      );
    });

    return () => {
      if (form.formState.isSubmitSuccessful) localStorage.removeItem(key);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return form;
};

export default useCachedForm;
