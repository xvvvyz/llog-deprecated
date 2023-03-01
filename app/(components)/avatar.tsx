'use client';

import formatImageUrl from '(utilities)/format-image-url';
import generateImageLoader from '(utilities)/generate-image-loader';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const sizes = {
  md: { className: 'h-8 w-8', imgSizes: '32px' },
  sm: { className: 'h-6 w-6 text-sm', imgSizes: '24px' },
  xs: { className: 'h-5 w-5 text-xs', imgSizes: '20px' },
};

interface AvatarProps {
  className?: string;
  file?: string | File | null;
  name: string;
  size?: keyof typeof sizes;
}

const Avatar = ({ className, file, name, size = 'md' }: AvatarProps) => {
  const src = formatImageUrl(file);

  return (
    <div
      className={twMerge(
        'relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-alpha-1 uppercase tracking-tighter text-fg-3',
        sizes[size].className,
        className
      )}
    >
      {src ? (
        <Image
          alt=""
          className="object-cover object-center"
          fill
          loader={generateImageLoader({ aspectRatio: '1:1' })}
          sizes={sizes[size].imgSizes}
          src={src}
        />
      ) : (
        <span aria-hidden>{name[0]}</span>
      )}
    </div>
  );
};

export default Avatar;
