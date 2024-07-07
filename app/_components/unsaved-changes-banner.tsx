import Button from '@/_components/button';
import Tip from '@/_components/tip';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface UnsavedChangesBannerProps<T extends FieldValues> {
  className?: string;
  form: UseFormReturn<T>;
}

const UnsavedChangesBanner = <T extends FieldValues>({
  className,
  form,
}: UnsavedChangesBannerProps<T>) => (
  <div className={twMerge('flex items-center justify-center gap-3', className)}>
    <Tip className="leading-snug" tipClassName="max-w-[18rem]" side="top">
      Unsaved changes are stored locally on your device until you save or
      discard them.
      <Button
        className="mt-4 w-full"
        colorScheme="transparent"
        disabled={!form.formState.isDirty}
        onClick={() => form.reset()}
        size="sm"
      >
        <XCircleIcon className="w-5 text-fg-4" />
        Discard changes
      </Button>
    </Tip>
    <span className="smallcaps text-fg-4">
      {form.formState.isDirty ? 'Unsaved changes' : 'No unsaved changes'}
    </span>
  </div>
);

export default UnsavedChangesBanner;
