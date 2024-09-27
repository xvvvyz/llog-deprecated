'use client';

import formatImageUrl from '@/_utilities/format-image-url';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  className?: string;
  file?: string | File | null;
  id?: string;
}

const Avatar = ({ className, file, id = '' }: AvatarProps) => {
  if (!file && !id) return null;

  return (
    <div
      className={twMerge(
        'relative size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
    >
      <Image
        alt=""
        className="bg-alpha-2 object-cover object-center"
        fill
        sizes="80px"
        src={
          formatImageUrl(file) ??
          `https://api.dicebear.com/7.x/shapes/png?seed=${id}&backgroundColor=ffdfbf,f88c49,c0aede,d1d4f9,f1f4dc,ffd5dc,0a5b83,1c799f,69d2e7,b6e3f4&backgroundType=solid&shape1=ellipseFilled,polygonFilled,rectangleFilled,line,polygon,rectangle,ellipse&shape2[]&shape2Color=f1f4dc,f88c49,0a5b83,1c799f,69d2e7,transparent&shape3[]`
        }
      />
    </div>
  );
};

export default Avatar;
