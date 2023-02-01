'use client';

import formatImageUrl from '(utilities)/format-image-url';
import generateImageLoader from '(utilities)/generate-image-loader';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { BoxProps } from './box';

const sizes = {
  md: { className: 'h-9 w-9', imgSizes: '36px' },
  sm: { className: 'h-7 w-7 text-sm', imgSizes: '28px' },
};

interface AvatarProps extends BoxProps {
  file?: string | File | null;
  name: string;
  size?: keyof typeof sizes;
}

const Avatar = ({
  className,
  file,
  name,
  size = 'md',
  ...rest
}: AvatarProps) => {
  const src = formatImageUrl(file);

  return (
    <div
      className={twMerge(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-alpha-1 uppercase text-alpha-3',
        sizes[size].className,
        !src && 'border border-alpha-2',
        className
      )}
      {...rest}
    >
      {src ? (
        <Image
          alt={`${name} avatar`}
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
